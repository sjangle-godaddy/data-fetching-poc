import Link from "next/link";
import ReduxProvider from "@/redux/provider";
import TodoApp from "@/components/redux/TodoApp";

export default function ReduxPage() {
  return (
    <ReduxProvider>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Redux + Reduxful</h1>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Full CRUD using reduxful with connect(), mapStateToProps, and manual refetch after mutations.
        </p>
        <TodoApp />
      </div>
    </ReduxProvider>
  );
}
