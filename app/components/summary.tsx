import React from 'react'
import ScoreGauge from './score-gauge'
import ScoreBadge from './score-badge';

const Category =({title, score}:{title:string, score:number})=>{
  const textColor = score >= 90 ? 'text-green-500' : score >= 70 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-600';

  return (
    <div className='resume-summary'>
      <div className='category'>
        <div className='flex flex-row gap-2 items-center justify-center'>
          <p className='text-2xl'>{title}</p>
          <ScoreBadge score={score}/>
        </div>
        <p className='text-2xl'>
          <span className={textColor}>{score}</span>
        </p>
      </div>
    </div>
  )
}

const Summary = ({feedback}:{feedback:Feedback}) => {
  return (
    <div className='bg-white rounded-2xl shadow-md w-full'>
      <div className='flex flex-row items-center p-4 gap-8'>
        <ScoreGauge score={feedback.overallScore}/>
        <div className='flex flex-col gap-2'>
          <h2 className='text-2xl font-bold'>Le Score de Votre CV</h2>
          <p className='text-sm text-gray-500'>
            Votre score global est basé sur plusieurs critères, y compris la lisibilité, la pertinence des mots-clés, et la structure du contenu. Un score plus élevé indique un CV mieux optimisé pour les systèmes de suivi des candidatures (ATS) et les recruteurs.
          </p>
        </div>
      </div>
      <Category title="Ton & Style" score={feedback.toneAndStyle.score || 0}/>
      <Category title="Contenu" score={feedback.content.score || 0}/>
      <Category title="Structure" score={feedback.structure.score || 0}/>
      <Category title="Compétences" score={feedback.skills.score || 0}/>
    </div>
  )
}

export default Summary