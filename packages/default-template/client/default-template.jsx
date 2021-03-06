DefaultTemplate = React.createClass({
	mixins:[ReactMeteorData],
	getMeteorData(){
		return {
			result: PanoplyCMSCollections.Sites.findOne()
		};
	},
	componentDidMount: function() {
		require('../imports/style.css')
		document.title = this.data.result.name;
		if(PanoplyRouter.current().path == '/'){

			if($('meta[name=keywords]').length){
	  		$('meta[name=keywords]').attr('content', this.data.result.siteMetaKeyword);
	  	} else {
				let metakey = document.createElement('meta');
				metakey.name = "keywords"
				metakey.content = this.data.result.siteMetaKeyword
				document.getElementsByTagName('head')[0].appendChild(metakey)
	  	}
	  	if($('meta[name=description]').length){
	  		$('meta[name=description]').attr('content', this.data.result.siteMetaDesc);
	  	} else {  		
				let metadesc = document.createElement('meta');
				metadesc.name = "description"
				metadesc.content = this.data.result.siteMetaDesc
				document.getElementsByTagName('head')[0].appendChild(metadesc)
	  	}			
		}
	},
	componentDidUpdate: function() {
		document.title = this.data.result.name;
		if(PanoplyRouter.current().path == '/'){

			if($('meta[name=keywords]').length){
	  		$('meta[name=keywords]').attr('content', this.data.result.siteMetaKeyword);
	  	} else {
				let metakey = document.createElement('meta');
				metakey.name = "keywords"
				metakey.content = this.data.result.siteMetaKeyword
				document.getElementsByTagName('head')[0].appendChild(metakey)
	  	}
	  	if($('meta[name=description]').length){
	  		$('meta[name=description]').attr('content', this.data.result.siteMetaDesc);
	  	} else {  		
				let metadesc = document.createElement('meta');
				metadesc.name = "description"
				metadesc.content = this.data.result.siteMetaDesc
				document.getElementsByTagName('head')[0].appendChild(metadesc)
	  	}			
		}
	},
	render() {
		return (
			<div>
				<FrontHeader module={this.props.top} />
				<div className="blog-header">
					<div className="container">
						<Logo data={this.data.result} />
					</div>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-sm-8 blog-main">
							{this.props.content}
						</div>
						{/*<!-- /.blog-main -->*/}
						<div className="col-sm-3 col-sm-offset-1 blog-sidebar">
							<SidePanel module={this.props.sidebar} />
						</div>
						{/*<!-- /.blog-sidebar -->*/}
					</div>
						{/*<!-- /.row -->*/}
				</div>
				{/*<!-- /.container -->*/}
				<FrontFooter module={this.props.footer} />
			</div>
		)
	}
});


DefaultArticle = React.createClass({
	mixins:[ReactMeteorData],
  getMeteorData(){
  	Meteor.subscribe('articlesFind')
    return {
      article: PanoplyCMSCollections.Articles.findOne({_id: this.props.id, trash:false})
    } 
  },
  componentDidMount: function() {
  	if(PanoplyRouter.current().path != '/'){

	  	if($('meta[name=keywords]').length){
	
	  		this.data.article.metaKeyword != '' ? $('meta[name=keywords]').attr('content', this.data.article.metaKeyword) : '';
	  	} else {
				let metakey = document.createElement('meta');
				metakey.name = "keywords"
				metakey.content = this.data.article.metaKeyword
				this.data.article.metaKeyword != '' ? document.getElementsByTagName('head')[0].appendChild(metakey) : '';
	  	}
	  	if($('meta[name=description]').length){
	  		this.data.article.metaDescription != '' ? $('meta[name=description]').attr('content', this.data.article.metaDescription) : ''
	  	} else {  		
				let metadesc = document.createElement('meta');
				metadesc.name = "description"
				metadesc.content = this.data.article.metaDescription
				this.data.article.metaDescription != '' ? document.getElementsByTagName('head')[0].appendChild(metadesc) : ''
	  	}
	  }
	},
  componentDidUpdate: function() {
  	if(PanoplyRouter.current().path != '/'){

	  	if($('meta[name=keywords]').length){
	
	  		this.data.article.metaKeyword != '' ? $('meta[name=keywords]').attr('content', this.data.article.metaKeyword) : '';
	  	} else {
				let metakey = document.createElement('meta');
				metakey.name = "keywords"
				metakey.content = this.data.article.metaKeyword
				this.data.article.metaKeyword != '' ? document.getElementsByTagName('head')[0].appendChild(metakey) : '';
	  	}
	  	if($('meta[name=description]').length){
	  		this.data.article.metaDescription != '' ? $('meta[name=description]').attr('content', this.data.article.metaDescription) : ''
	  	} else {  		
				let metadesc = document.createElement('meta');
				metadesc.name = "description"
				metadesc.content = this.data.article.metaDescription
				this.data.article.metaDescription != '' ? document.getElementsByTagName('head')[0].appendChild(metadesc) : ''
	  	}
	  }
	},
	render(){
		if(!_.has(this.data.article, "_id"))
			return <div>Loading...</div>

		return <ArticleFullView {...this.data.article} />
	}
})

ArticleFullView = article => {
	return <div className="blog-post">
          <h2 className="blog-post-title">{article.title.toUpperCase()}</h2>
          <p className="blog-post-meta">{new Date(article.createdAt).toDateString()} by <a href="#">{article.owner}</a></p>
          <div dangerouslySetInnerHTML={{__html:article.article}} />
        	<ShowTags tags={article.tags} />
        </div>
}

DefaultCategory = React.createClass({
	mixins:[ReactMeteorData],
  getMeteorData(){
	  Meteor.subscribe('articlesFind');
    return {
      articles: PanoplyCMSCollections.Articles.find({category: this.props.id, trash:false}).fetch()
    } 
  },
	render(){
		if(!this.data.articles.length)
			return <div>Loading...</div>

		return (<div>
			{this.data.articles.map(a => {
				return <ArticleListView key={a._id} {...a} />
			})}
		</div>)
	}
})

ArticleListView = article => {
	let route = PanoplyRouter.current().route.path.split('/')
	alias = ''
	if(route[route.length - 1] != ''){
		alias = PanoplyRouter.current().route.path+'/'+article.alias
	} else {
		alias = PanoplyRouter.current().route.path+article.alias
	}
	return <div className="blog-post">
          <h2 className="blog-post-title">{article.title.toUpperCase()}</h2>
          <p className="blog-post-meta">{new Date(article.createdAt).toDateString()} by <a href="#">{article.owner}</a></p>
          <div dangerouslySetInnerHTML={{__html:article.article.substr(0, 300)}} />
        	<ShowTags tags={article.tags} />
          <div className="pull-right"><a href={alias} className="btn btn-default">Read More</a></div>
          <div className="clear-both"></div>
        </div>
}

ShowTags = React.createClass({
	mixins:[ReactMeteorData],
  getMeteorData(){
    return {
      tags: PanoplyCMSCollections.Tags.find({}).fetch()
    } 
  },
	render: function(){
		return (
			<div className="tag">
				{this.props.tags.map(tag => {
					let t = _.find(this.data.tags, t => { return t._id == tag })
					if(t)
						return <span key={tag} > <a className="label label-info"> {t.title} </a> </span>
					else return ''
				})}
			</div>
		)
	}
})