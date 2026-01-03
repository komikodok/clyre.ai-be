
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { Document } from "@langchain/core/documents";
import mongoose from "mongoose";
import { DocsResponse } from "../types/docs.type";
import { extractPdfDocuments, extractUrlDocuments, processDocuments } from "../utils/document-processor";
import ResponseError from "../utils/error";

export const docsService = {
    addDocument: async (topic: string, type: 'file' | 'url', data: { file?: Express.Multer.File, url?: string }): Promise<DocsResponse['data']> => {
        let docs: Document[] = [];
        let source = "";

        if (type === 'file' && data.file) {
            if (data.file.mimetype === 'application/pdf') {
                docs = await extractPdfDocuments(data.file.buffer);
            } else {
                const text = data.file.buffer.toString('utf-8');
                docs = [new Document({ pageContent: text })];
            }
            source = data.file.originalname;
        } else if (type === 'url' && data.url) {
            docs = await extractUrlDocuments(data.url);
            source = data.url;
        } else {
            throw new ResponseError("Invalid input data", 400);
        }

        docs.forEach(doc => {
            doc.metadata = {
                ...doc.metadata,
                source,
                type,
                topic,
                createdAt: new Date().toISOString()
            };
        });

        const splitDocs = await processDocuments(docs);

        const collectionName = `${topic}_docs`;
        if (!mongoose.connection.db) {
            throw new Error("Database connection not established");
        }

        const collection = mongoose.connection.db.collection(collectionName) as any;

        const embeddings = new HuggingFaceInferenceEmbeddings({
            apiKey: process.env.HUGGINGFACEHUB_API_KEY,
            model: "sentence-transformers/all-MiniLM-L6-v2"
        });

        await MongoDBAtlasVectorSearch.fromDocuments(splitDocs, embeddings, {
            collection,
            indexName: "default",
            textKey: "text",
            embeddingKey: "embedding",
        });

        return {
            message: "Document processed and stored successfully",
            topic,
            collection: collectionName,
            documents_added: splitDocs.length
        };
    }
};
