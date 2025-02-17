import { user_register_account } from "../services/Auth/user-register-account.js";
import { handle_multipart_data } from "../utils/handle-multipart-data.js";
import { user_create_blogs } from "../services/Blogs/user-create-blogs.js";
import { user_login } from "../services/Auth/user-login.js";
import { Router } from "express";
import { check_user_auth } from "../middlewares/check-user-auth.js";
import { user_edit_blog } from "../services/Blogs/user-edit-blog.js";
import { user_delete_blog } from "../services/Blogs/user-delete-blog.js";
import { user_get_blogs } from "../services/Blogs/user-get-blogs.js";
import { user_blogs_by_slugs } from "../services/Blogs/user-blog-by-slugs.js";
import { user_blogs_by_tagName } from "../services/Blogs/user-blogs-by-tag.js";
import { user_search_blog } from "../services/Blogs/user-search-blog.js";

const router = Router();

//------------auth handlers--------------------------------------------
router.post("/auth/register-account", user_register_account);
router.post("/auth/login", user_login);
//---------------------------------------------------------------------

//------------blogs handlers--------------------------------------------
router.post(
  "/blogs/create-blog",
  check_user_auth,
  handle_multipart_data.single("coverImage"),
  user_create_blogs
);
router.put(
  "/blogs/:id",
  check_user_auth,
  handle_multipart_data.single("coverImage"),
  user_edit_blog
);
router.get("/blogs/tags/:tagName", check_user_auth, user_blogs_by_tagName);
router.get("/blogs/slug/:slug", check_user_auth, user_blogs_by_slugs);
router.get("/blogs/get-blogs", check_user_auth, user_get_blogs);
router.delete("/blogs/:id", check_user_auth, user_delete_blog);
router.get("/blogs/search", check_user_auth, user_search_blog);
//---------------------------------------------------------------------
export default router;
