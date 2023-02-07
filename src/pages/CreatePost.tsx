import React, {MouseEvent, useState} from 'react';

import preview from '../assets/preview.png'
import {getRandomPrompt} from '../utils/getRandomPrompt'
import {FormField, Loader} from '../components'
import {useNavigate} from "react-router-dom";
import {IForm} from "../models/IForm";
import axios from "axios";

const CreatePost = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState<IForm>({
        name: '',
        prompt: '',
        photo: '',
    })
    const [generatingImg, setGeneratingImg] = useState(false)
    const [loading, setLoading] = useState(false)

    // Сохраняет изображение
    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (form.prompt && form.photo) {
            setLoading(true)

            try {
                await axios.post(`http://localhost:8080/api/v1/post`, JSON.stringify(form), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                 navigate('/')

            } catch (err) {
                alert(err)
            } finally {
                setLoading(false)
            }
        } else {
            alert('Пожалуйста введите предложение и сгенерируйте изображение')
        }
    }

    // Меняет данные которые вводятся в input
    const handleChange = (e: any) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    // Генерирует описание картинки
    const handleSurpriseMe = () => {
        const randomPrompt = getRandomPrompt(form.prompt)
        setForm({...form, prompt: randomPrompt})
    }

    // Генерирует изображение
    async function generateImage(event: MouseEvent<HTMLButtonElement>) {
        if (form.prompt) {
            try {
                setGeneratingImg(true)

                const {data} = await axios.post('http://localhost:8080/api/v1/dalle', {
                    prompt: form.prompt
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                setForm({...form, photo: `data:image/jpeg;base64,${data.photo}`})
            } catch (err) {
                alert(err)
            } finally {
              setGeneratingImg(false)
            }
        } else {
            alert('Пожалуйста введите запрос')
        }
    }

    return (
        <section className="max-w-7xl mx-auto">
            <div>
                <h1 className="font-extrabold text-[#222328] text-[32px]">Создать</h1>
                <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">Создайте коллекцию фантазийных и
                    визуально ошеломляющих изображений с использованием DALL-E AI и поделитесь с комьюнити</p>
            </div>

            <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <FormField
                        labelName={'Ваше имя'}
                        type={'text'}
                        name={'name'}
                        placeholder={'John Doe'}
                        value={form.name}
                        handleChange={handleChange}
                    />
                    <FormField
                        labelName={'Ваш запрос'}
                        type={'text'}
                        name={'prompt'}
                        placeholder={'a painting of a fox in the style of Starry Night'}
                        value={form.prompt}
                        handleChange={handleChange}
                        isSurpriseMe
                        handleSurpriseMe={handleSurpriseMe}
                    />

                    <div className={'relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg ' +
                        'focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'}>
                        {form.photo ? (
                            <img src={form.photo} alt={form.prompt} className={'w-full h-full object-contain'} />
                        ) : (
                            <img src={preview} alt="preview" className="w-9/12 h-9/12 object-contain opacity-40"/>
                        )}

                        {generatingImg && (
                            <div className={`absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg`}>
                                <Loader />
                            </div>
                        )}
                    </div>
                </div>

                <div className='mt-5 flex gap-5'>
                    <button
                        type={'button'}
                        onClick={generateImage}
                        className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        {generatingImg ? 'Создание...' : 'Создать'}
                    </button>
                </div>

                <div className="mt-10">
                    <p className="mt-2 text-[#666e75] text-[14px]">После создания изображения, которое вам понравится, вы можете поделиться им с другими пользователся</p>
                    <button type={'submit'} className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                        {loading ? 'Сохранение...' : 'Поделиться с комьюнити'}
                    </button>
                </div>

            </form>
        </section>
    );
};

export default CreatePost;