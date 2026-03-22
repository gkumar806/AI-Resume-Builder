import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AIChatSession } from './../../../../../service/AIModal';

const prompt = "Job Title: {jobTitle} , Depends on job title give me list of summery for 3 experience level, Mid Level and Fresher level in 3-4 lines in array format, With summery and experience_level Field in JSON Format"

function Summery({ enabledNext }) {

    // ✅ Safe context
    const context = useContext(ResumeInfoContext) || {};
    const { resumeInfo, setResumeInfo } = context;

    const [summery, setSummery] = useState('');
    const [loading, setLoading] = useState(false);
    const params = useParams();

    // ✅ FIX: always array
    const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState([]);

    useEffect(() => {
        if (resumeInfo?.summery) {
            setSummery(resumeInfo.summery);
        }
    }, [resumeInfo]);

    useEffect(() => {
        if (summery) {
            setResumeInfo({
                ...resumeInfo,
                summery: summery
            });
        }
    }, [summery]);

    const GenerateSummeryFromAI = async () => {
        try {
            setLoading(true);
            const PROMPT = prompt.replace('{jobTitle}', resumeInfo?.jobTitle || '');
            const result = await AIChatSession.sendMessage(PROMPT);

            const parsed = JSON.parse(result.response.text());
            setAiGenerateSummeryList(parsed || []);
        } catch (err) {
            console.error(err);
            toast("AI generation failed");
        } finally {
            setLoading(false);
        }
    }

    const onSave = (e) => {
        e.preventDefault();

        setLoading(true);

        const data = {
            data: {
                summery: summery
            }
        };

        GlobalApi.UpdateResumeDetail(params?.resumeId, data).then(resp => {
            enabledNext(true);
            toast("Details updated");
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }

    return (
        <div>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Summary</h2>
                <p>Add Summary for your job title</p>

                <form className='mt-7' onSubmit={onSave}>
                    <div className='flex justify-between items-end'>
                        <label>Add Summary</label>

                        <Button
                            variant="outline"
                            onClick={GenerateSummeryFromAI}
                            type="button"
                            size="sm"
                            className="border-primary text-primary flex gap-2"
                        >
                            <Brain className='h-4 w-4' />
                            Generate from AI
                        </Button>
                    </div>

                    {/* ✅ FIXED textarea */}
                    <Textarea
                        className="mt-5"
                        required
                        value={summery}
                        onChange={(e) => setSummery(e.target.value)}
                    />

                    <div className='mt-2 flex justify-end'>
                        <Button type="submit" disabled={loading}>
                            {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* ✅ Safe rendering */}
            {aiGeneratedSummeryList.length > 0 && (
                <div className='my-5'>
                    <h2 className='font-bold text-lg'>Suggestions</h2>

                    {aiGeneratedSummeryList.map((item, index) => (
                        <div
                            key={index}
                            onClick={() =>
                              setSummery(
                                typeof item?.summary === "string"
                                  ? item.summary
                                  : item?.summary?.text || ""
                              )
                            }
                            className='p-5 shadow-lg my-4 rounded-lg cursor-pointer'
                        >
                            <h2 className='font-bold my-1 text-primary'>
                                Level: {item?.experience_level}
                            </h2>
                            <p>
                             {typeof item?.summary === "string"
                                ? item.summary
                                : item?.summary?.text || ""}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Summery