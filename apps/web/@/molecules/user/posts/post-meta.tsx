// generate react component meta data for post with author, date, and tags
import { TPostItem } from "app/user/posts/post-actions"
import dayjs from "dayjs"
import Link from "next/link"

export type PostMetaProps = {
  post: TPostItem
}

export default function PostMeta({ post }: PostMetaProps) {
  return (
    <div className="mt-6 flex items-center">
      <Link href={`/users/${post.author.id}`}>
        <div className="flex items-center">
          <i className="ri-user-3-line text-3xl text-gray-500" />
          <div className="ml-2 flex flex-col">
            <div className="text-sm font-bold text-gray-500">{post.author.name}</div>
            <div className="text-sm text-gray-400">
              Posted on {dayjs(post.createdAt).format("MMMM D, YYYY")}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
