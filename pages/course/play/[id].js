import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DefaultLayout from '@/components/layout/default';
import scss from './play.module.scss';

const VideoPlayer = ({ video_path }) => {
    console.log('Video path:', video_path);
    if (!video_path) {
        return <div>No video available</div>;
    }
    return (
        <div className={scss.videoWrapper}>
            <video key={video_path} controls className={scss.videoPlayer}>
                <source src={`http://localhost:3005${video_path}`} type='video/mp4' />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

const CourseContent = ({ chapters, onLessonSelect, currentLessonId }) => {
    return (
        <div className={scss.courseContent}>
            {chapters.map((chapter, index) => (
                <div key={chapter.id} className={scss.section}>
                    <h4>Section {index + 1}: {chapter.name}</h4>
                    <div>
                        {chapter.lessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className={`${scss.lesson} ${currentLessonId === lesson.id ? scss.active : ''}`}
                                onClick={() => onLessonSelect(lesson)}
                            >

                                <span>{lesson.name}</span>
                                <span>{lesson.duration}min</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};


export default function CoursePlay() {
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);

    const getCourse = async (id) => {
        try {
            const apiURL = `http://localhost:3005/api/course/${id}`;
            const res = await fetch(apiURL);
            const result = await res.json();
            console.log('API response:', result);
            setCourse(result.data);
            if (result.data.chapters.length > 0 && result.data.chapters[0].lessons.length > 0) {
                setCurrentLesson(result.data.chapters[0].lessons[0]);
            }
        } catch (error) {
            console.error('Failed to fetch course:', error);
            // 可以在這裡添加錯誤處理邏輯，例如設置錯誤狀態
        }
    };

    useEffect(() => {
        if (router.isReady && router.query.id) {
            getCourse(router.query.id);
        }
    }, [router.isReady, router.query.id]);

    const handleLessonChange = (lesson) => {
        console.log('Changing lesson to:', lesson);
        setCurrentLesson(lesson);
    };

    // 如果課程數據還沒加載完成，不渲染任何內容
    if (!course) {
        return null;
    }

    return (
        <>
            <Head>
                <title>{`課程播放： ${course.title}`}</title>
            </Head>

            <div className={scss.containerFluid}>
                <div className={["container d-flex", scss.mainContent].join(" ")}>
                    <div className={[scss.videoContent, "col-8"].join(" ")}>
                        {currentLesson && <VideoPlayer video_path={currentLesson.video_path} />}
                        <h2>{course.title}</h2>
                    </div>
                    <aside className={[scss.sidebar, "col-4"].join(" ")}>
                        <CourseContent
                            chapters={course.chapters}
                            onLessonSelect={handleLessonChange}
                            currentLessonId={currentLesson?.id}
                        />
                    </aside>
                </div>
            </div>
        </>
    );
}

CoursePlay.layout = DefaultLayout;