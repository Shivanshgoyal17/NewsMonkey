import React, {useEffect, useLayoutEffect, useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";



const News = (props) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
    
  const capitalizeFirstLetter = (string) =>{
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


  const updateNews = async () => {
    props.setProgress(10)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30)
    let parsedData = await data.json()
    props.setProgress(70)
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(parsedData.setLoading)
    props.setProgress(100)
  }

  useEffect(() =>{
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
    // eslint-disable-next-line 
  }, [])


  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1)
    let data = await fetch(url);
    let parsedData = await data.json()
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
  };

    return (
      <>
        <h1 className="text-center" style={{margin: '35px 0px', marginTop: '90px'}}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
        {loading && <Spinner/>}

        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner/>}
        >

          <div className="container">
            <div className="row">
              {!loading && articles.map((element)=>{
                  return <div className="col-md-4" key={element.url}>
                  <NewsItem title={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                </div>
              })}
            </div>
          </div>
        </InfiniteScroll>

        
      </>
    );
}

News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: 'general'
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string
}

export default News;




// this.state ki help se constructor ke andar hum kaise state ko set kar sakte hain. state ko props ki help se bhi set kar sakte hain, props karke.

// state ka use hum tab karte hain jab baar baar kisi cheez ki value badalna hai, aur wo variable apke page me baar baar update hota rahe bina page ko reload kare.

// jo cheez ko hum baar baar badalna ni chahte screen pe usko state se set ni karte. Props pass karke set kar dete hain. (Usage props ka aisa hai ki kabhi change karna pada to sari jagah pe ek sath change kar sakte hain.) (Props are read only)

// componentDidMount is a lifecycle method, it runs after the render method.

// Explanation of line 86 - jab element of title null hai to else me jayega aur empty string ki tarah treat karega so we'll not get slice error which we were getting until we tackled null values of some objects. (Refer - Video 27, 7.00 mins)

// Buttons me action lagane ke liye hum state ka use karege, previous ke andar state ko change karege, page ko 1 se kam kar denge.

// We have to manage ki kab tak next pe click karne pe khali page na a jaye, to uske liye hum calculate kar sakte hain, hum log pageSize parameter se pata kar sakte hain. Its in newsapi documentation.

// PageSize means how many articles will be shown in a page and totalcount will tell us total number of articles.
