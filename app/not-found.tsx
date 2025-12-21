import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-8xl font-black text-white/5 mb-4">404</h2>
            <h3 className="text-3xl font-bold mb-4">Page Not Found</h3>
            <p className="text-gray-400 max-w-md mb-8">
                Could not find the requested resource. It might have been moved or doesn&apos;t exist.
            </p>
            <Link href="/">
                <Button className="bg-fuchsia-600 hover:bg-fuchsia-700">
                    Return Home
                </Button>
            </Link>
        </div>
    )
}
