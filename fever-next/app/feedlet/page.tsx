'use client'

export default function FeedletPage() {
  const bookmarklet = `javascript:(function(){window.open(window.location.origin+'/api/bookmarklet?url='+encodeURIComponent(location.href));})();`
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Feedlet Bookmarklet</h1>
      <p>Drag the link below to your bookmarks bar:</p>
      <a className="text-blue-600 underline" href={bookmarklet}>Subscribe with Fever</a>
    </div>
  )
}
