import React, { useState, type FormEvent } from 'react'
import FileUploader from '~/components/file-uploader';
import Navbar from '~/components/navbar'

const Upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [status, setStatus] = useState(''); 
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget.closest('form');
        if(!form) return;

        const formData = new FormData(form);

        const companyName = formData.get('company-name');
        const jobTitle = formData.get('job-title');
        const jobDescription = formData.get('job-description');

        console.log({companyName, jobTitle, jobDescription, file});
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