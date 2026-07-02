import { redirect } from "next/navigation";

// The forum grew up and moved: everything shared lives at /resources/community
// now (Worksheets · Chat · Announcements). Old links land on the Chat tab.
// Thread permalinks (/resources/forum/[id]) still resolve.
export default function ForumRedirect() {
  redirect("/resources/community?tab=chat");
}
