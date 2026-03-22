import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'

function Education() {

  const [loading, setLoading] = useState(false)
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const params = useParams()

  const [educationalList, setEducationalList] = useState([])

  // ✅ Load once (no loop)
  useEffect(() => {
    if (Array.isArray(resumeInfo?.education)) {
      setEducationalList(resumeInfo.education)
    }
  }, [])

  // Handle input change
  const handleChange = (event, index) => {
    const newEntries = [...educationalList]
    const { name, value } = event.target
    newEntries[index][name] = value
    setEducationalList(newEntries)
  }

  // Add new education
  const AddNewEducation = () => {
    setEducationalList([
      ...educationalList,
      {
        universityName: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ])
  }

  // Remove last
  const RemoveEducation = () => {
    setEducationalList(prev => prev.slice(0, -1))
  }

  // ✅ FINAL SAVE FUNCTION (STRAPI v5 FIX)
  const onSave = () => {
    setLoading(true)

    const safeData = educationalList.map(({ id, ...rest }) => ({
      universityName: rest.universityName || "",
      degree: rest.degree || "",
      major: rest.major || "",
      startDate: rest.startDate || null,
      endDate: rest.endDate || null,
      description: rest.description || ""
    }))

    // 🔥 STRAPI v5 FORMAT (IMPORTANT)
    const data = {
      data: {
        
          education: safeData
        
      }
    }

    console.log("FINAL EDUCATION DATA:", data)

    GlobalApi.UpdateResumeDetail(params.resumeId, data)
      .then(() => {

        // update local context
        setResumeInfo(prev => ({
          ...prev,
          education: safeData
        }))

        toast('Details updated!')
      })
      .catch((error) => {
        console.log("ERROR:", error.response?.data)
        toast('Server Error, Please try again!')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>

      <h2 className='font-bold text-lg'>Education</h2>
      <p>Add Your educational details</p>

      <div>
        {Array.isArray(educationalList) && educationalList.length > 0 ? (
          educationalList.map((item, index) => (
            <div key={item.id || index}>
              <div className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>

                <div className='col-span-2'>
                  <label>University Name</label>
                  <Input
                    name="universityName"
                    value={item?.universityName || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div>
                  <label>Degree</label>
                  <Input
                    name="degree"
                    value={item?.degree || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div>
                  <label>Major</label>
                  <Input
                    name="major"
                    value={item?.major || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div>
                  <label>Start Date</label>
                  <Input
                    type="date"
                    name="startDate"
                    value={item?.startDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div>
                  <label>End Date</label>
                  <Input
                    type="date"
                    name="endDate"
                    value={item?.endDate || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

                <div className='col-span-2'>
                  <label>Description</label>
                  <Textarea
                    name="description"
                    value={item?.description || ""}
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-400">No education added</div>
        )}
      </div>

      <div className='flex justify-between'>

        <div className='flex gap-2'>
          <Button variant="outline" onClick={AddNewEducation} className="text-primary">
            + Add More Education
          </Button>

          {educationalList.length > 0 && (
            <Button variant="outline" onClick={RemoveEducation} className="text-primary">
              - Remove
            </Button>
          )}
        </div>

        <Button disabled={loading} onClick={onSave}>
          {loading
            ? <LoaderCircle className='animate-spin' />
            : 'Save'}
        </Button>

      </div>

    </div>
  )
}

export default Education