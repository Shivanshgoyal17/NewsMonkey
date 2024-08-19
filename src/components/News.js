import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";



export class News extends Component {
  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general'
  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }
  
  capitalizeFirstLetter = (string) =>{
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  constructor(props){
    super(props);
    console.log("I am a constructor from News component");
    this.state = {
        articles : [],
        loading: true,
        page: 1,
        totalResults: 0
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
  }

  async updateNews(){
    this.props.setProgress(10)
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading: true})
    let data = await fetch(url);
    this.props.setProgress(30)
    let parsedData = await data.json()
    this.props.setProgress(70)
    console.log(parsedData);
    this.setState({
      articles: parsedData.articles, 
      totalResults: parsedData.totalResults, 
      loading: false
    })
    this.props.setProgress(100)
  }

  async componentDidMount(){
    // console.log("cdm");
    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=c2599389dd764e86838d309d9dcf03fe&page=1&pageSize=${this.props.pageSize}`;   // this is the url to fetch the news 
    // this.setState({loading: true})
    // let data = await fetch(url);             // using fetch api, it takes the url and returns a promise so we can use async and await. An async function inside its body can wait for some promise to get resolve
    // // console.log(data);                    // ye apne aap me ek promise hai, to jo data aya hai usko apan use kar sakte hain, json ki tarah, etc.
    // let parsedData = await data.json()
    // console.log(parsedData);
    // this.setState({
    //   articles: parsedData.articles, 
    //   totalResults: parsedData.totalResults, 
    //   loading: false
    // })
    this.updateNews();
  }

  handlePrevClick = async ()=>{
    // console.log("Previous")

    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=c2599389dd764e86838d309d9dcf03fe&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
    // this.setState({loading: true})
    // let data = await fetch(url);          
    // let parsedData = await data.json()
    // console.log(parsedData);
    // this.setState({
    //   page: this.state.page - 1,
    //   articles: parsedData.articles,
    //   loading: false
    // })
    this.setState({page: this.state.page - 1})
    this.updateNews();
  }

  handleNextClick = async ()=>{
    // console.log("Next")
    // if(this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)){

    // }
    // else{
    //   let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=c2599389dd764e86838d309d9dcf03fe&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
    //   this.setState({loading: true})
    //   let data = await fetch(url);          
    //   let parsedData = await data.json()
    //   console.log(parsedData);
    //   this.setState({
    //     page: this.state.page + 1,
    //     articles: parsedData.articles,
    //     loading: false
    //   })
    // }
    this.setState({page: this.state.page + 1})
    this.updateNews();
  }

  fetchMoreData = async () => {
    this.setState({page: this.state.page + 1})
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json()
    console.log(parsedData);
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults
    })
  };

  render() {
    return (
      <>
        <h1 className="text-center" style={{margin: '35px 0px'}}>NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
        {this.state.loading && <Spinner/>}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
        >

          <div className="container">
            <div className="row">
              {!this.state.loading && this.state.articles.map((element)=>{
                  return <div className="col-md-4" key={element.url}>
                  <NewsItem title={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                </div>
              })}
            </div>
          </div>
        </InfiniteScroll>

        {/* <div className="container d-flex justify-content-between">
        <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}> &larr; Previous</button>
        <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr; </button>
        </div> */}
        
      </>
    );
  }
}

export default News;




// this.state ki help se constructor ke andar hum kaise state ko set kar sakte hain. state ko props ki help se bhi set kar sakte hain, this.props karke.

// state ka use hum tab karte hain jab baar baar kisi cheez ki value badalna hai, aur wo variable apke page me baar baar update hota rahe bina page ko reload kare.

// jo cheez ko hum baar baar badalna ni chahte screen pe usko state se set ni karte. Props pass karke set kar dete hain. (Usage props ka aisa hai ki kabhi change karna pada to sari jagah pe ek sath change kar sakte hain.) (Props are read only)

// componentDidMount is a lifecycle method, it runs after the render method.

// Explanation of line 86 - jab element of title null hai to else me jayega aur empty string ki tarah treat karega so we'll not get slice error which we were getting until we tackled null values of some objects. (Refer - Video 27, 7.00 mins)

// Buttons me action lagane ke liye hum state ka use karege, previous ke andar state ko change karege, page ko 1 se kam kar denge.

// We have to manage ki kab tak next pe click karne pe khali page na a jaye, to uske liye hum calculate kar sakte hain, hum log pageSize parameter se pata kar sakte hain. Its in newsapi documentation.

// PageSize means how many articles will be shown in a page and totalcount will tell us total number of articles.
