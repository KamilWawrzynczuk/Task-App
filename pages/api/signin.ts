import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { comparePasswords, createJWT } from '@/lib/auth';
import { serialize } from 'cookie';

export default async function signin(
  req: NextApiRequest,
  res: NextApiResponse
) {
   
  if (req.method === 'POST') {
    const user = await db.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if(!user) {
        return res.status(401).json({ error: 'User not found' });
    }

    const isUser = await comparePasswords(req.body.password, user?.password);

    if (isUser) {
      const jwt = await createJWT(user);

      res.setHeader(
        'Set-Cookie',
        serialize(process.env.COOKIE_NAME, jwt, {
          httpOnly: true,
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7,
        })
      );
      res.status(201).json({ msg: 'User is log in.' });
    } else {
      res.status(401).json({ msg: 'Not authorize' });
    }
  } else {
    res.status(402).json({ msg: 'Error during log in' });
  }
}
