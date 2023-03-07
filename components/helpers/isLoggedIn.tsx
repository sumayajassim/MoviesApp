
import { verify } from 'jsonwebtoken'
const SECRET = process.env.SECRET_KEY
if(!SECRET) throw Error('Secret key is not provided!')

const isLoggedIn = (handler) => {
    return async (req, res) => {
        try {
            // const authorization = req.header
            const authorization = req.headers["authorization"]
            if (!authorization) throw new Error("not authenticated")
            const token = authorization
            verify(token, SECRET);
            return handler(req, res)
        } catch (e) {
            console.log(e)
            res.status(401).send()
        }
    }
}

export default isLoggedIn