export interface Email {
    id: number;
    sender_email: string;
    recipient_email: string;
}

export interface EmailResponse {
    emails: Email[] | null;
    error: string | null;
}

