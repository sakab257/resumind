import { prepareInstructions } from 'constants/index';
import React, { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router';
import FileUploader from '~/components/file-uploader';
import Navbar from '~/components/navbar'
import { convertPdfToImage } from '~/lib/pdf2img';
import { usePuterStore } from '~/lib/puter';
import { generateUUID } from '~/lib/utils';
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind | Telechargement du CV" },
    { name: "description", content: "Feedback intelligent pour votre future carrière!" },
  ];
}

const Upload = () => {
    const {auth, isLoading, fs, ai, kv} = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState(''); 
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleAnalyze = async ({companyName, jobTitle, jobDescription, file}: {companyName:string, jobTitle:string, jobDescription:string, file: File}) => {
        setIsProcessing(true);
        setStatus('Téléchargement du CV...');

        const uploadedFile = await fs.upload([file]);

        if(!uploadedFile) return setStatus('Erreur lors du téléchargement du CV.');

        setStatus('Conversion du CV en image...');
        const imageFile = await convertPdfToImage(file);
        
        if(!imageFile.file || imageFile.error) {
            console.error('PDF conversion error:', imageFile.error);
            return setStatus(`Erreur lors de la conversion du CV en image: ${imageFile.error || 'Erreur inconnue'}`);
        }

        setStatus('Téléchargement de l\'image du CV...');
        const uploadedImage = await fs.upload([imageFile.file]);
        if(!uploadedImage) return setStatus('Erreur lors du téléchargement du CV en image.');

        setStatus('Analyse du CV...');

        const uuid = generateUUID();

        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback : ''
        }

        await kv.set(`analysis-${uuid}`, JSON.stringify(data));

        setStatus('Génération du feedback...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobTitle, jobDescription})
        );

        if(!feedback) return setStatus('Erreur lors de l\'analyse du CV.');

        const feedbackText = typeof feedback.message.content === "string" ? feedback.message.content : feedback.message.content[0].text;

        data.feedback = JSON.parse(feedbackText);
        await kv.set(`analysis-${uuid}`, JSON.stringify(data));

        setStatus('Terminé ! Redirection vers les résultats...');
        console.log(data);
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget.closest('form');
        if(!form) return;

        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({companyName,jobTitle,jobDescription,file});
        // console.log({companyName, jobTitle, jobDescription, file});
    }


  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar />
        <section className="main-section">
            <div className='page-heading py-16'>
                <h1>Feedback intelligent pour votre travail de rêve</h1>
                {isProcessing ? (
                    <>
                    <h2>{status}</h2>
                    <img src='/images/resume-scan.gif' className='w-full' />
                    </>
                ) : (
                    <h2>Importer votre CV pour recevoir un feedback personnalisé et un score ATS</h2>
                )}
                {!isProcessing && (
                    <form id='upload-form' onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8' >
                        <div className='form-div'>
                            <label htmlFor='company-name'>Nom de l'entreprise</label>
                            <input type="text" name="company-name" placeholder="Nom de l'entreprise..." id='company-name'></input>
                        </div>
                        <div className='form-div'>
                            <label htmlFor='job-title'>Profession</label>
                            <input type="text" name="job-title" placeholder="Profession..." id='job-title'></input>
                        </div>
                        <div className='form-div'>
                            <label htmlFor='job-description'>Description</label>
                            <textarea rows={5} name="job-description" placeholder="Description..." id='job-description'></textarea>
                        </div>
                        <div className='form-div'>
                            <label htmlFor='uploader'>Téléchargez votre CV</label>
                            <FileUploader onFileSelect={handleFileSelect}/>
                        </div>
                        <button className='primary-button' type="submit">Analyser mon CV</button>
                    </form>
                )}
            </div>

        </section>
    </main>
  )
}

export default Upload