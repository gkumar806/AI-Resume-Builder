import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext } from 'react'
import PersonalDetailPreview from './preview/PersonalDetailPreview'
import SummeryPreview from './preview/SummeryPreview'
import ExperiencePreview from './preview/ExperiencePreview'
import EducationalPreview from './preview/EducationalPreview'
import SkillsPreview from './preview/SkillsPreview'
console.log("PersonalDetailPreview:", PersonalDetailPreview);
console.log("SummeryPreview:", SummeryPreview);
console.log("ExperiencePreview:", ExperiencePreview);
console.log("EducationalPreview:", EducationalPreview);
console.log("SkillsPreview:", SkillsPreview);
function ResumePreview() {

  // ✅ Safe context handling
  const context = useContext(ResumeInfoContext) || {}
  const { resumeInfo, setResumeInfo } = context

  // ✅ Prevent crash when data not loaded
  if (!resumeInfo) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading Resume...
      </div>
    )
  }

  return (
    <div
      className="shadow-lg h-full p-14 border-t-[20px]"
      style={{
        borderColor: resumeInfo?.themeColor || '#000'
      }}
    >
      {/* Personal Detail */}
      <PersonalDetailPreview resumeInfo={resumeInfo} />

      {/* Summary */}
      <SummeryPreview resumeInfo={resumeInfo} />

      {/* Experience */}
      {resumeInfo?.Experience?.length > 0 && (
        <ExperiencePreview resumeInfo={resumeInfo} />
      )}

      {/* Education */}
      {resumeInfo?.education?.length > 0 && (
        <EducationalPreview resumeInfo={resumeInfo} />
      )}

      {/* Skills */}
      {resumeInfo?.skills?.length > 0 && (
        <SkillsPreview resumeInfo={resumeInfo} />
      )}
    </div>
  )
}

export default ResumePreview