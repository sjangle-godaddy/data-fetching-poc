import Link from "next/link";
import ReduxProvider from "@/redux/provider";
import UserList from "@/components/redux/UserList";

export default function ReduxUsersPage() {
  return (
    <ReduxProvider>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Users (Redux + Reduxful)</h1>
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
        <p className="mb-6 text-sm text-gray-500">
          This page fetches data using reduxful + redux with connect(), mapStateToProps, and mapDispatchToProps.
        </p>
        <UserList />
      </div>
    </ReduxProvider>
  );
}
