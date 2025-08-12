'use client';

import React from 'react';
import { useState } from 'react';
import ChevronIcon from '@/app/(private)/components/svgs/ChevronIcon';
import PrinterIcon from '@/app/(private)/components/svgs/PrinterIcon';
import MailIcon from '@/app/(private)/components/svgs/MailIcon';
import { PDFViewer, Document, pdf } from '@react-pdf/renderer';
import EmailLoad from './EmailLoad';
import { DocMetaData } from '../../../types/mailTypes';
import { sendEmail } from '../../../utils/mailUtils';

type Doc = {
    displayPdf: React.ReactNode;
    metadata: DocMetaData;
}

interface PDFDisplayProps {
    displayDocs: Doc[];
    receiver: string;
    handleClosePdfs: () => void;
}

export default function PDFDisplay({ displayDocs, receiver, handleClosePdfs }: PDFDisplayProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // state for print all
    const [printAll, setPrintAll] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailError, setEmailError] = useState<string | null>(null);

    if (displayDocs.length === 0) return null;
    const displayPdfs = displayDocs.map((doc) => doc.displayPdf);
    const metadatas = displayDocs.map((doc) => doc.metadata);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % displayDocs.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + displayDocs.length) % displayDocs.length);
    };

    const newDocument = (index: number) => {
        return (
            <Document>
                {displayDocs[index].displayPdf}
            </Document>
        )
    }

    const handleSendEmail = async () => {
        setSendingEmail(true);
        // Create new array of documents with metadata
        const documentsWithMetadata = displayDocs.map((doc, index) => ({
            document: newDocument(index),
            metadata: doc.metadata
        }));
        
        // generate files from documents
        let files : File[] = []
        try {
            files = await Promise.all(
                documentsWithMetadata.map(({ document, metadata }, ) =>
                  pdf(document)
                    .toBlob()
                    .then(blob => new File([blob], `${metadata.fileName}`, { type: 'application/pdf' }))
                )
              );
            if (files.length !== documentsWithMetadata.length) {
                throw new Error("Couldn't generate right # of PDFs");
            }
        } catch (error) {
            setEmailError('Failed to generate PDFs: ' + error);
        } 
        // send email with files and metadata
        try {
            await sendEmail(files, metadatas);
        } catch (error) {
            setEmailError('Failed to send email: ' + error);
        } finally {
            setSendingEmail(false);
        }
    }
    const pages: React.ReactNode[] = displayPdfs

    return (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full z-50">
            {/* Container */}

            {/* Blurred background overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm " />

            {/* PDF container */}
            <div className="relative w-screen max-w-[1000px] h-screen flex items-center justify-center ">
                {/* Close button */}
                <button
                    onClick={handleClosePdfs}
                    className="cursor-pointer absolute top-4 right-4 w-10 h-10 bg-[#2A7D7B] rounded-full flex items-center justify-center shadow-md hover:bg-[#48B4A0] transition-colors z-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {/* Left Chevron */}
                <button
                    onClick={handlePrevious}
                    className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                    <ChevronIcon className="w-6 h-6 text-gray-800" />
                </button>

                {/* show pdfs */}
                <div>
                    {/* Button Headers */}
                    <div className='flex items-center justify-center w-full gap-4 text-sm pb-2'>
                        <button
                            onClick={() => { setPrintAll(!printAll) }}
                            className="flex items-center justify-center gap-2 h-[50px] w-[120px] bg-white border-2 border-[#2A7D7B] rounded-lg text-[#2A7D7B] hover:bg-[#2A7D7B] hover:text-white transition-colors cursor-pointer"
                        >
                            <PrinterIcon className="w-5 h-5" />
                            {printAll ? 'Print One' : 'Print All'}
                        </button>
                        <button
                            onClick={handleSendEmail}
                            className="flex items-center justify-center gap-2 h-[50px] w-[120px] bg-white border-2 border-[#B6E8E4] rounded-lg text-[#2A7D7B] hover:bg-[#2A7D7B] hover:text-white transition-colors cursor-pointer"
                        >
                            <MailIcon className="w-5 h-5 text-[#B6E8E4]" />
                            Email
                        </button>
                    </div>
                    <div className={`w-[800px] h-[700px] ${sendingEmail ? 'flex items-center justify-center bg-white' : 'bg-gray-800'}`}>
                        {sendingEmail ? <EmailLoad receiver={receiver} /> : emailError ?
                            <div className="text-red-500 text-center w-full h-full bg-white flex flex-col items-center justify-center gap-4">
                                <p> {emailError} </p>
                                <button 
                                    onClick={() => setEmailError(null)} 
                                    className="px-4 py-2 border-2 border-[#2A7D7B] rounded-lg text-[#2A7D7B] hover:bg-[#2A7D7B] hover:text-white transition-colors"
                                >
                                    Try again
                                </button>
                            </div> :
                            (
                                <PDFViewer key={printAll ? 'all' : `single-${currentIndex}`} className="w-full h-full">
                                    <Document>
                                        {printAll ? pages : pages[currentIndex]}
                                    </Document>
                                </PDFViewer>
                            )}
                    </div>
                </div>
                {/* Right Chevron */}
                <button
                    onClick={handleNext}
                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
                >
                    <ChevronIcon className="w-6 h-6 text-gray-800 rotate-180" />
                </button>
            </div>
        </div>
    );
}
