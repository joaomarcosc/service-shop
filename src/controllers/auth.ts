import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { auth } from '../models';

export const register = async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword } = req.body

  if (!name) {
    return res.status(402).json({ msg: 'Campo name obrigatório' })
  }

  if (!email) {
    return res.status(402).json({ msg: 'Campo email obrigatório' })
  }

  if (!password) {
    return res.status(402).json({ msg: 'Campo password obrigatório' })
  }

  if (!confirmPassword) {
    return res.status(402).json({ msg: 'Campo confirmPassword obrigatório' })
  }

  if (password !== confirmPassword) {
    return res.status(402).json({ msg: 'Senhas não são iguais' })
  }

  const alreadyExists = await auth.User.findOne({ email: email })

  if (alreadyExists) {
    return res.status(401).json({ msg: 'Email já cadastrado' })
  }

  const genSalt = await bcrypt.genSalt(12)
  const hashPassword = await bcrypt.hash(password, genSalt)

  const user = new auth.User({ email, name, password: hashPassword })

  try {
    await user.save();
    console.log(user)

    return res.status(201).json({ msg: 'Conta criada com sucesso' })
  } catch (_) {

    return res.status(500).json({ msg: 'Erro no servidor, por favor tente mais tarde' })
  }
}

export const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await auth.User.findOne({ email })
  const verifyPassword = await bcrypt.compare(password, user.password);
  const PRIVATE_KEY = process.env.PRIVATE_KEY || ''

  if (!user) {
    return res.status(402).json({ msg: 'Usuário não encontrando' })
  }

  if (!verifyPassword) {
    return res.status(402).json({ msg: 'Senha incorreta' })
  }

  const token = jwt.sign({
    id: user.id
  }, PRIVATE_KEY, {
    expiresIn: '1h'
  })

  return res.status(200).json({ token })
}