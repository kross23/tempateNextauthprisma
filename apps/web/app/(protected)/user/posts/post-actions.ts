"use server"

import prisma, { Prisma } from "database"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getServerSession } from "@/utitls/auth"

const postSelect = {
  id: true,
  title: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.PostSelect

const getPostItem = Prisma.validator<Prisma.PostDefaultArgs>()({
  select: postSelect,
})

export type TPostItem = Prisma.PostGetPayload<typeof getPostItem>

export const getPosts = async (): Promise<TPostItem[]> => {
  try {
    const session = await getServerSession()
    const posts = await prisma.post.findMany({
      select: postSelect,
      where: {
        author: {
          id: session?.user?.id,
        },
      },
    })

    return posts
  } catch (error) {
    throw error
  }
}

export const getPostById = async (id: number): Promise<TPostItem> => {
  try {
    const session = await getServerSession()
    const post = await prisma.post.findUnique({
      where: {
        id,
        author: {
          id: session?.user?.id,
        },
      },
      select: postSelect,
    })

    return post
  } catch (error) {
    throw error
  }
}

export const createPost = async (data: Prisma.PostCreateInput): Promise<TPostItem> => {
  let newPost: TPostItem

  try {
    const session = await getServerSession()

    newPost = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: session?.user?.id,
      },
      select: postSelect,
    })
  } catch (error) {
    throw error
  }

  revalidatePath("posts")
  redirect(newPost.id.toString())
}

export const updatePost = async (id: number, data: Prisma.PostUpdateInput): Promise<TPostItem> => {
  try {
    const session = await getServerSession()

    await prisma.post.update({
      where: {
        id,
        authorId: session?.user?.id,
      },
      data,
      select: postSelect,
    })
    revalidatePath("posts")
    revalidatePath(`posts/${id}`)
  } catch (error) {
    throw error
  }

  redirect(`../../posts/${id}`)
}

export const deletePost = async (id: number): Promise<void> => {
  try {
    const session = await getServerSession()

    await prisma.post.delete({
      where: {
        id,
        authorId: session?.user?.id,
      },
      select: postSelect,
    })

    revalidatePath("posts")
    revalidatePath(`posts/${id}`)
  } catch (error) {
    throw error
  }
}
