// Port of the live site's 404 page (rendered without the site navbar/footer).
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- plain link like the live site */}
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
}
