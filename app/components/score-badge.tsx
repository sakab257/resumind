import React from 'react'

interface ScoreBadgeProps {
    score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({score}) => {
    let badgeColor = '';
    let badgeText = '';

    if(score >= 90){
        badgeColor = 'bg-badge-blue text-blue-600';
        badgeText = 'Excellent';
    } else if (score >= 70){
        badgeColor = 'bg-badge-green text-green-600';
        badgeText = 'Très Bon';
    } else if (score >= 50){
        badgeColor = 'bg-badge-yellow text-yellow-600';
        badgeText = 'Bon';
    } else {
        badgeColor = 'bg-badge-red text-red-600';
        badgeText = 'À améliorer';
    } 
  return (
    <div className={`px-3 py-1 rounded-full ${badgeColor}`}>
        <p className='text-sm font-medium'>{badgeText}</p>
    </div>
  )
}

export default ScoreBadge