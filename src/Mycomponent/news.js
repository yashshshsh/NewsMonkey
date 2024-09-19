import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import InfiniteScroll from 'react-infinite-scroll-component';

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const News = (props) => {
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [articles, setArticles] = useState([]);

    const updateNews = async () => {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles(parsedData.articles);
        setTotalResults(parsedData.totalResults);
        setLoading(false);
        props.setProgress(100);
    };

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
        updateNews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const handlePrevClick = () => {
        setPage(page - 1);
    };

    const handleNextClick = () => {
        setPage(page + 1);
    };

    const fetchMoreData = async () => {
        const nextPage = page + 1;
        setPage(nextPage);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`;
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles([...articles, ...parsedData.articles]);
    };

    return (
        <>
            <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length < totalResults}
                loader={<Spinner />}
                scrollThreshold={0.9}
                endMessage={
                    <p style={{ textAlign: 'center' }}>
                        <b>No more articles to load</b>
                    </p>
                }
            >
                <div className="container">
                    <div className="row">
                        {articles.map((element) => {
                            return (
                                <div className="col-md-4" key={element.url}>
                                    <div className="card">
                                        <img src={element.urlToImage ? element.urlToImage : "https://images.unsplash.com/photo-1550439062-609e1531270e"} className="card-img-top" alt="..." />
                                        <div className="card-body">
                                            <h5 className="card-title">{element.title}</h5>
                                            <p className="card-text">{element.description}</p>
                                            <a href={element.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-dark">Read more</a>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    )
}

export default News;
