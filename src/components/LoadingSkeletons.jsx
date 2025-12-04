export function EventCardSkeleton() {
    return (
        <div className="card animate-pulse">
            {/* Image skeleton */}
            <div className="relative h-48 -mx-6 -mt-6 mb-4 bg-gray-200 rounded-t-xl"></div>

            {/* Content skeleton */}
            <div className="space-y-3">
                {/* Title */}
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>

                {/* Description */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>

                {/* Meta info */}
                <div className="flex items-center space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>

                {/* Price */}
                <div className="pt-3 border-t border-gray-200">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
            </div>
        </div>
    );
}

export function EventDetailSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image */}
                        <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>

                        {/* Title and description */}
                        <div className="card animate-pulse space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="card animate-pulse space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function DashboardStatSkeleton() {
    return (
        <div className="card animate-pulse">
            <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            </div>
        </div>
    );
}

export function TableRowSkeleton({ columns = 4 }) {
    return (
        <tr className="animate-pulse">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                </td>
            ))}
        </tr>
    );
}
