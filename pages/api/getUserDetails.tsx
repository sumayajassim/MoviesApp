import { wishlist } from './../../node_modules/.prisma/client/index.d';
import { NextApiRequest , NextApiResponse } from 'next'
import {prisma} from '../../lib/prisma'
import axios, { AxiosResponse } from 'axios'
import isLoggedIn from '@/components/helpers/isLoggedIn';

const API_KEY = process.env.API_KEY
if(!API_KEY) throw Error('...')

async function getUserDetails(req: NextApiRequest , res: NextApiResponse){

    const user = await prisma.user.findUniqueOrThrow({
        where:{
            id :req.user.user.id
        },
        include: {
            wishlist: true,
            cart: true
        }
    })


    if(user){
    
        const wishlistMovies: any =  (await Promise.all(user.wishlist!.moviesIDs.map(async (id) => await getMovie(id)))).filter(Boolean)
        const cartMovies: any =  (await Promise.all(user.cart!.moviesIDs.map(async (id) => await getMovie(id)))).filter(Boolean)
        res.json({wishlist: wishlistMovies,cart: cartMovies, user})


    }else{
        res.status(404).json({message:"Something wrong happened!"});
    }

   

}

const getMovie = async (id: string) => {
    try {

        const {data} = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
            return data
    } catch {

        return null

    }
}

export default isLoggedIn(getUserDetails)
