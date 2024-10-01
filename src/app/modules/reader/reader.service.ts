import { objectId } from "../../utils/function";
import Reader from "./reader.model";

const createReaderIntoDB = async (payload:{userId:string,postId:string}) => {
    const reader = await Reader.find({user:objectId(payload.userId),post:objectId(payload.postId)})
    if(reader){
        return null
    }
    return await Reader.create({user:payload.userId,post:payload.postId})
};


export const ReaderService = {
    createReaderIntoDB
}