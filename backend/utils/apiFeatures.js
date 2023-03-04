class ApiFeatures{
    constructor(query,querySting){
        this.query = query;
        this.querySting = querySting;
    }
    search(){
        const keyword = this.querySting.keyword ? {
            //if find
            name :{
                $regex: this.querySting.keyword,
                $options: "i",
            }
        } : 
        {
            //if not find
        }
        //console.log(keyword)
        this.query = this.query.find({ ...keyword});
        return this;
    }
    filter(){
        const queryCopy = {...this.querySting}
        //Removing some field for category
        const removeFields = ["keyword","page","limit"]

        removeFields.forEach((key) =>delete queryCopy[key])
        //console.log(queryCopy)
        //Filter for price and rating
        let querySting = JSON.stringify(queryCopy);
        querySting = querySting.replace(/\b(gt|gte|lt|lte)\b/g,(key) => `$${key}`);

        
        this.query = this.query.find(JSON.parse(querySting));
        //console.log(queryCopy)
        return this;
    }

    pagination(resultsPerPage){
        const currentPage = Number(this.querySting.page) || 1;

        const skip = resultsPerPage * (currentPage - 1);

        this.query = this.query.limit(resultsPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeatures