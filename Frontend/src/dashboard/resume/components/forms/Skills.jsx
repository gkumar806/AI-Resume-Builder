import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import GlobalApi from './../../../../../service/GlobalApi'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

function Skills() {

    const [skillsList, setSkillsList] = useState([])
    const { resumeId } = useParams()
    const [loading, setLoading] = useState(false)
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)

    // ✅ SAFE: update only if data actually changed (prevents loop)
    useEffect(() => {
        if (Array.isArray(resumeInfo?.skills)) {
            setSkillsList(prev =>
                JSON.stringify(prev) !== JSON.stringify(resumeInfo.skills)
                    ? resumeInfo.skills
                    : prev
            )
        }
    }, [resumeInfo])

    // Handle change
    const handleChange = (index, name, value) => {
        const newEntries = [...skillsList]
        newEntries[index] = {
            ...newEntries[index],
            [name]: value
        }
        setSkillsList(newEntries)
    }

    // Add skill
    const AddNewSkills = () => {
        setSkillsList([
            ...skillsList,
            { name: '', rating: 0 }
        ])
    }

    // Remove skill
    const RemoveSkills = () => {
        setSkillsList(prev => prev.slice(0, -1))
    }

    // ✅ SAVE FUNCTION (fixed format)
    const onSave = () => {
        setLoading(true)

        const safeData = (Array.isArray(skillsList) ? skillsList : []).map(({ id, ...rest }) => ({
            name: rest?.name || "",
            rating: Number(rest?.rating) || 0   // 🔥 important
        }))

        const data = {
            data: {
                skills: safeData
            }
        }

        console.log("FINAL SKILLS DATA:", data)

        GlobalApi.UpdateResumeDetail(resumeId, data)
            .then(() => {
                // update context safely
                setResumeInfo({
                    ...resumeInfo,
                    skills: safeData
                })

                setLoading(false)
                toast('Details updated!')
            })
            .catch((error) => {
                console.log("ERROR:", error.response?.data)
                setLoading(false)
                toast('Server Error')
            })
    }

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <h2 className='font-bold text-lg'>Skills</h2>
            <div>Add your top professional key skills</div>

            <div>
                {Array.isArray(skillsList) && skillsList.length > 0 ? (
                    skillsList.map((item, index) => (
                        <div key={index} className='flex justify-between mb-2 border rounded-lg p-3'>

                            <div className='w-full mr-4'>
                                <label className='text-xs'>Name</label>
                                <Input
                                    value={item?.name || ""}
                                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                                />
                            </div>

                            <Rating
                                style={{ maxWidth: 120 }}
                                value={item?.rating || 0}
                                onChange={(v) => handleChange(index, 'rating', v)}
                            />

                        </div>
                    ))
                ) : (
                    <div className="text-sm text-gray-400">No skills added</div>
                )}
            </div>

            <div className='flex justify-between'>
                <div className='flex gap-2'>
                    <Button variant="outline" onClick={AddNewSkills} className="text-primary">
                        + Add More Skill
                    </Button>
                    <Button variant="outline" onClick={RemoveSkills} className="text-primary">
                        - Remove
                    </Button>
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

export default Skills