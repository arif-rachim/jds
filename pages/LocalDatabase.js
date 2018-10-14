
class LocalDatabase{
    saveOrUpdate(storeId,questionId,answer){
        let database = this.read();
        let jdsData = database.filter(data => (data.store == storeId && data.question == questionId));
        jdsData = jdsData && jdsData.length > 0 ? jdsData[0] : false;
        if(jdsData){
            jdsData.answer = answer;
            jdsData.modifiedOn = new Date().getTime();
        }else{
            jdsData = {question:questionId,store:storeId,answer:answer,createOn:new Date().getTime()}
            database.push(jdsData);
        }
        localStorage.setItem('jds-data',JSON.stringify(database));
    }
    read(){
        const jdsDataString = localStorage.getItem('jds-data') || "[]";
        const jdsData = JSON.parse(jdsDataString);
        return jdsData;
    }
    readById(storeId,questionId){
        const database = this.read();
        const filteredData = database.filter(data => (data.question == questionId && data.store == storeId));
        if(filteredData && filteredData.length > 0){
            return filteredData[0];
        }
        return false;
    }

    delete(storeId,questionId){
        let database = this.read();
        database = database.filter(data => data.store !== storeId && data.question !== questionId);
        localStorage.setItem('jds-data',JSON.stringify(database));
    }
}

const db = new LocalDatabase();

export default db;