
export interface DocsUploadRequest {
    type: 'file' | 'url'
    url?: string
}

export interface DocsResponse {
    data: {
        message: string
        topic: string
        collection: string
        documents_added: number
    }
}

export interface DocumentChunk {
    pageContent: string
    metadata: {
        source: string
        type: 'file' | 'url'
        topic: string
        chunk_index?: number
        [key: string]: any
    }
}
