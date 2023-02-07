import React, {useEffect, useState} from 'react';
import {Loader, Card, FormField} from "../components";
import axios from "axios";
import {IPost} from "../models/IPost";


interface IRenderCards {
    data: IPost[] | null,
    title: string
}

const RenderCards = ({data, title}: IRenderCards) => {
    if (data) {
        if (data?.length > 0) {
            return (
                data.map((post) => (
                    <Card key={post._id} {...post} />
                ))
            )
        }
    }

    return (
        <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
    )


}

const Home = () => {
    const [loading, setLoading] = useState(false)
    const [allPosts, setAllPosts] = useState<IPost[]>([])
    const [searchText, setSearchText] = useState('')

    const [searchResults, setSearchResults] = useState<IPost[]>([])
    const [searchTimeout, setSearchTimeout] = useState(0)

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true)

            try {
                const {data} = await axios.get(`${import.meta.env.VITE_BASE_URL}api/v1/post`)

                if (data.success) {
                    setAllPosts(data.data.reverse())
                }
            } catch (err) {
                alert(err)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])


    const handleSearchChange = (e: any) => {
        clearTimeout(searchTimeout)

        setSearchText(e.target.value)

        setSearchTimeout(
            setTimeout(() => {
                const searchResults = allPosts.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase())
                    || item.prompt.toLowerCase().includes(searchText.toLowerCase()))


                setSearchResults(searchResults)
            }, 500)
        )

    }


    return (
        <section className="max-w-7xl mx-auto">
            <div>
                <h1 className="font-extrabold text-[#222328] text-[32px]">Работы комьюнити:</h1>
                <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">Посмотрите коллекцию фантазийных и
                    визуально ошеломляющих изображений сгенерированых DALL-E AI</p>
            </div>

            <div className="mt-16">
                <FormField
                    labelName={"Поиск по описанию"}
                    type={"text"}
                    name={"text"}
                    placeholder={"Введите описание"}
                    value={searchText}
                    handleChange={handleSearchChange}
                />
            </div>

            <div className="mt-10">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader/>
                    </div>
                ) : (
                    <>
                        {searchText && (
                            <h2 className="font-medium text-[#666e75] text-xl mb-3">Показать результаты по запросу <span
                                className="text-[#222328]">{searchText}</span></h2>
                        )}
                        <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
                            {searchText ? (
                                // @ts-ignore
                                <RenderCards data={searchResults} title={"Ничего не найдено"}/>
                            ) : (
                                // @ts-ignore
                                <RenderCards data={allPosts} title={"Записи не найдены"}/>
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Home;