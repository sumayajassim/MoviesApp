import { NextApiRequest , NextApiResponse } from "next";

type Data = {
    message: string
  }

export default function test(req: NextApiRequest , res: NextApiResponse<Data>){
    res.status(200).json({message: "test test"})
}

