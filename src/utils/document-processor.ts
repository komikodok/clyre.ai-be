import { Document } from "@langchain/core/documents";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const extractPdfDocuments = async (buffer: Buffer): Promise<Document[]> => {
    try {
        const uint8 = new Uint8Array(buffer);
        const blob = new Blob([uint8]);
        const loader = new WebPDFLoader(blob as any, { splitPages: false });
        return await loader.load();
    } catch (error) {
        console.error("Error extracting PDF documents:", error);
        throw new Error("Failed to extract documents from PDF");
    }
};

export const extractUrlDocuments = async (url: string): Promise<Document[]> => {
    try {
        const loader = new CheerioWebBaseLoader(url);
        return await loader.load();
    } catch (error) {
        console.error("Error extracting URL documents:", error);
        throw new Error("Failed to extract documents from URL");
    }
};

export const processDocuments = async (docs: Document[], chunkSize: number = 1000, chunkOverlap: number = 200): Promise<Document[]> => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap,
    });

    return await splitter.splitDocuments(docs);
};
