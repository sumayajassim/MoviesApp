import { NextApiRequest, NextApiResponse } from "next";
import jwtDecode from "jwt-decode";

export default function test(req: NextApiRequest, res: NextApiResponse) {
  // const testt = jwtDecode(
  //   "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MDZiZWEwMzc0NTE2OTA4NzJhNDQzNiIsImZpcnN0TmFtZSI6Im9iYW1hIiwibGFzdE5hbWUiOiJvYmFtYSIsImVtYWlsQWRkcmVzcyI6Im9iYW1hQGVtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJDVOdHdaMUF5QXJlT256UEh5cnM3bXVtWDFYRHY3bW4vcHI2VEhoOHhGUmlXWmhna1k0dWp5IiwiYmFsYW5jZSI6MTAwLCJjcmVhdGVkQXQiOiIyMDIzLTAzLTA3VDA0OjMzOjM2LjIxMloiLCJ1cGRhdGVkQXQiOiIyMDIzLTAzLTA3VDA0OjMzOjM2LjIxMloiLCJyb2xlIjoiREVGQVVMVCIsImlhdCI6MTY3ODE2MzYxNiwiZXhwIjoxNjc4NzY4NDE2fQ.sRh5eu2HJEe-sG--Zsba5CMaLFlSAJAS4HFoJr0coD4"
  // );
  // res.json(testt);

  let arr = [1];

  res.json(arr.length);
}
