import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { Button } from "@/components/ui/button"
import newLogo from "../assets/kinraiDe-logo.svg"

import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "KinraiD",
      },
    ],
    links: [
      {
        rel: "stylesheet", href: appCss,
      },
      { rel: "icon", sizes: "180x180", href: newLogo },
    ],
  }),
  notFoundComponent: () => (
    <main className="flex min-h-svh flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-xl text-muted-foreground">
        ขออภัย ไม่พบหน้าทีคุณต้องการ
      </p>
      <Button asChild className="mt-8">
        <a href="/">กลับหน้าแรก</a>
      </Button>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
