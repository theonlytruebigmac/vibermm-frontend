export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text">
        Welcome to VibeRMM
      </h1>
      <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Modern, scalable Remote Monitoring & Management for MSPs and IT pros. Start by exploring the dashboard, managing assets, or automating your workflows.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
        <div className="rounded-xl bg-white dark:bg-gray-900 shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">📊</span>
          <div className="font-semibold text-lg mb-1">Dashboard</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">View real-time metrics, alerts, and system health at a glance.</div>
          <a href="#" className="text-primary font-medium hover:underline">Open Dashboard</a>
        </div>
        <div className="rounded-xl bg-white dark:bg-gray-900 shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">🖥️</span>
          <div className="font-semibold text-lg mb-1">Assets</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Manage endpoints, monitor status, and deploy updates.</div>
          <a href="#" className="text-primary font-medium hover:underline">View Assets</a>
        </div>
        <div className="rounded-xl bg-white dark:bg-gray-900 shadow p-6 flex flex-col items-center">
          <span className="text-3xl mb-2">⚡</span>
          <div className="font-semibold text-lg mb-1">Automation</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">Run scripts, schedule tasks, and automate remediation.</div>
          <a href="#" className="text-primary font-medium hover:underline">Automate Now</a>
        </div>
      </div>
    </section>
  );
}
