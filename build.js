import fs from 'node:fs';
import { textToSearchTerms, OPTIONS_ALL } from '@cityssm/text-to-search-terms';
const repositoryURLs = [
    'https://cityssm.github.io/council-agendas-2022',
    'https://cityssm.github.io/council-agendas-2021',
    'https://cityssm.github.io/council-agendas-2020',
    'https://cityssm.github.io/council-agendas-2019',
    'https://cityssm.github.io/council-agendas-2018',
    'https://cityssm.github.io/council-agendas-2017',
    'https://cityssm.github.io/council-agendas-2016',
    'https://cityssm.github.io/council-agendas-2015',
    'https://cityssm.github.io/council-agendas-2014',
    'https://cityssm.github.io/council-agendas-2013',
    'https://cityssm.github.io/council-agendas-2012',
    'https://cityssm.github.io/council-agendas-2011',
    'https://cityssm.github.io/council-agendas-2010',
    'https://cityssm.github.io/council-agendas-2009',
    'https://cityssm.github.io/council-agendas-2008',
    'https://cityssm.github.io/council-agendas-2007',
    'https://cityssm.github.io/council-agendas-2006',
    'https://cityssm.github.io/council-agendas-2005',
    'https://cityssm.github.io/council-agendas-2004',
    'https://cityssm.github.io/council-agendas-2003',
    'https://cityssm.github.io/council-agendas-2002',
    'https://cityssm.github.io/council-agendas-2001',
    'https://cityssm.github.io/council-agendas-2000',
    'https://cityssm.github.io/council-agendas-1999'
];
async function buildAgendaMetadata() {
    const allAgendaMetadata = [];
    for (const repositoryURL of repositoryURLs) {
        const metadataURL = repositoryURL + '/metadata.json';
        console.log(`Fetching ${metadataURL} ...`);
        const metadataResponse = await fetch(metadataURL);
        const allPdfMetadata = (await metadataResponse.json());
        console.log(`- Processing ${allPdfMetadata.length} agendas.`);
        allPdfMetadata.reverse();
        for (const [pdfIndex, pdfMetadata] of allPdfMetadata.entries()) {
            console.log(`  - ${pdfIndex + 1} / ${allPdfMetadata.length} - ${pdfMetadata.fileName}`);
            delete pdfMetadata.author;
            delete pdfMetadata.title;
            const fileNameSplit = pdfMetadata.fileName.slice(0, -4).split(/[ _-]+/);
            const agendaDate = fileNameSplit[0] + '-' + fileNameSplit[1] + '-' + fileNameSplit[2];
            let agendaTitle = fileNameSplit[3];
            for (let index = 4; index < fileNameSplit.length; index += 1) {
                agendaTitle += ' ' + fileNameSplit[index];
            }
            pdfMetadata.fullContent = textToSearchTerms(pdfMetadata.fullContent ?? '', OPTIONS_ALL).join(' ');
            const agendaMetadata = Object.assign({
                url: repositoryURL + '/' + pdfMetadata.fileName,
                agendaDate,
                agendaTitle
            }, pdfMetadata);
            allAgendaMetadata.push(agendaMetadata);
        }
    }
    return allAgendaMetadata;
}
const agendaMetadata = await buildAgendaMetadata();
fs.writeFileSync('metadata.json', JSON.stringify(agendaMetadata, undefined, 2));
