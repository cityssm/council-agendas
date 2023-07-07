import type * as recorderTypes from '@cityssm/pdf-metadata-recorder/types';
declare global {
    interface AgendaMetadata extends recorderTypes.PdfMetadata {
        url: string;
        agendaDate: string;
        agendaTitle: string;
        searchCriteria?: string;
    }
}
