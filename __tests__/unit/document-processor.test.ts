
import { extractPdfDocuments, extractUrlDocuments, processDocuments } from "../../src/utils/document-processor";
import { Document } from "@langchain/core/documents";

// Mocking external dependencies
jest.mock("@langchain/community/document_loaders/fs/pdf", () => {
    return {
        PDFLoader: jest.fn().mockImplementation(() => {
            return {
                load: jest.fn().mockResolvedValue([
                    new Document({ pageContent: "PDF Content Page 1" }),
                    new Document({ pageContent: "PDF Content Page 2" })
                ])
            };
        })
    };
});

jest.mock("@langchain/community/document_loaders/web/cheerio", () => {
    return {
        CheerioWebBaseLoader: jest.fn().mockImplementation(() => {
            return {
                load: jest.fn().mockResolvedValue([
                    new Document({ pageContent: "Web Content" })
                ])
            };
        })
    };
});

describe("Document Processor", () => {
    it("extractPdfDocuments should return documents", async () => {
        const buffer = Buffer.from("fake pdf content");
        const docs = await extractPdfDocuments(buffer);
        expect(docs).toHaveLength(2);
        expect(docs[0].pageContent).toBe("PDF Content Page 1");
    });

    it("extractUrlDocuments should return documents", async () => {
        const docs = await extractUrlDocuments("http://example.com");
        expect(docs).toHaveLength(1);
        expect(docs[0].pageContent).toBe("Web Content");
    });

    it("processDocuments should split documents", async () => {
        const docs = [
            new Document({ pageContent: "A".repeat(2000) })
        ];
        // Default chunkSize is 1000. Expect split.
        const splitDocs = await processDocuments(docs);
        expect(splitDocs.length).toBeGreaterThan(1);
    });
});
