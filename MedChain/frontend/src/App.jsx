import { useEffect, useMemo, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Html5QrcodeScanner } from 'html5-qrcode'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const roles = ['Manufacturer', 'Distributor', 'Retailer', 'Consumer']

const adminRole = 'SuperAdmin'

const roleMeta = {
  Manufacturer: {
    mark: 'M',
    title: 'Production control',
    text: 'Register batches, issue traceable identities, and keep production moving.',
  },
  SuperAdmin: {
    mark: 'A',
    title: 'Super Admin control',
    text: 'Approve orders, manage records, and monitor the entire network.',
  },
  Distributor: {
    mark: 'D',
    title: 'Distribution desk',
    text: 'Source verified inventory and keep every handoff visible.',
  },
  Retailer: {
    mark: 'R',
    title: 'Retail operations',
    text: 'Manage store stock and verify every medicine before it reaches a patient.',
  },
  Consumer: {
    mark: 'C',
    title: 'Patient trust center',
    text: 'Look up a medicine and check its provenance in seconds.',
  },
}

function Logo({ dark = false }) {
  return (
    <div
      className={`flex items-center gap-3 ${dark ? 'text-white' : 'text-[var(--text-main)]'
        }`}
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--primary)] text-lg font-bold text-white shadow-[0_8px_24px_rgba(0,102,204,.22)]">
        ✚
      </span>

      <span className="font-display text-xl font-bold tracking-tight">
        med<span className="text-[var(--primary)]">chain</span>
      </span>
    </div>
  )
}

function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  const styles = {
    primary:
      'bg-ink text-white shadow-[0_8px_18px_rgba(11,18,32,.15)] hover:bg-[#202d43]',
    mint: 'bg-mint text-ink hover:bg-[#39d5aa]',
    ghost:
      'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    dark: 'border border-white/15 bg-white/10 text-white hover:bg-white/15',
    danger: 'bg-rose-50 text-rose-700 hover:bg-rose-100',
  }

  return (
    <button
      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

function Field({ label, className = '', ...props }) {
  return (
    <label
      className={`grid gap-2 text-sm font-semibold text-slate-600 ${className}`}
    >
      {label}

      <input
        className="min-h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-normal text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#25c79a] focus:ring-4 focus:ring-[#25c79a]/10"
        {...props}
      />
    </label>
  )
}
function Landing({
  onRole,
  onSignup,
  onAdmin,
  theme,
  onToggleTheme,
}) {
  const [about, setAbout] = useState(false)

  const isDark = theme === 'dark'

  const pageBg = 'bg-[var(--page-bg)] text-[var(--text-main)]'
  const sectionBg = 'bg-[var(--surface)]'
  const softBg = 'bg-[var(--surface-soft)]'
  const border = 'border-[var(--border)]'
  const mutedText = 'text-[var(--text-muted)]'
  const secondaryText = 'text-[var(--text-secondary)]'
  const mainText = 'text-[var(--text-main)]'
  const accent = 'text-[var(--primary)]'
  const accentBg = 'bg-[var(--primary-soft)]'
  const accentSolid = 'bg-[var(--primary)] text-white'
  const toggleButtonClass =
    'border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-main)]'

  if (about) {
    return (
      <div className={`min-h-screen ${pageBg}`}>
        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
          <Logo dark={isDark} />

          <div className="flex items-center gap-3">
            {/* THEME TOGGLE */}
            <button
              type="button"
              onClick={onToggleTheme}
              className={`grid h-10 w-10 place-items-center rounded-xl border transition ${toggleButtonClass}`}
              aria-label={
                isDark
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
            >
              {isDark ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path
                    strokeLinecap="round"
                    d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                  />
                </svg>
              )}
            </button>

            <Button
              variant={isDark ? 'dark' : 'ghost'}
              onClick={() => setAbout(false)}
            >
              ← Back to home
            </Button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 pb-24 pt-12">

          {/* INTRO */}
          <section className="grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
            <div>
              <div
                className={`mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[.24em] ${accent}`}
              >
                <span className="h-px w-10 bg-[var(--primary)]" />
                About MedChain
              </div>

              <h1 className="max-w-4xl font-display text-5xl font-bold leading-[.98] tracking-tight md:text-7xl">
                Medicine should never
                <span className={` ${accent}`}>
                  {' '}lose its story.
                </span>
              </h1>

              <p
                className={`mt-7 max-w-2xl text-lg leading-8 ${secondaryText}`}
              >
                MedChain is a blockchain-enabled medicine traceability
                system designed to make the journey of a medicine easier
                to track, verify, and understand.
              </p>
            </div>

            <div
              className={`rounded-3xl border p-6 ${border} ${sectionBg}`}
            >
              <p
                className={`text-xs font-bold uppercase tracking-[.18em] ${mutedText}`}
              >
                The idea
              </p>

              <p
                className={`mt-5 font-display text-2xl font-semibold leading-8 ${mainText}`}
              >
                One medicine.
                <br />
                One digital identity.
                <br />
                A traceable journey.
              </p>

              <div className={`mt-7 h-px ${border}`} />

              <div className="mt-5 flex items-center justify-between text-xs">
                <span className={mutedText}>
                  Built around
                </span>

                <span className={`font-semibold ${accent}`}>
                  Trust · Traceability · Verification
                </span>
              </div>
            </div>
          </section>


          {/* HOW IT WORKS */}
          <section className="mt-20">
            <div className="mb-8">
              <p
                className={`text-xs font-bold uppercase tracking-[.2em] ${accent}`}
              >
                How it works
              </p>

              <h2
                className={`mt-3 font-display text-3xl font-bold md:text-4xl ${mainText}`}
              >
                From registration to verification.
              </h2>
            </div>

            <div
              className={`grid gap-px overflow-hidden rounded-3xl border md:grid-cols-3 ${border} bg-[var(--border)]`}
            >
              {[
                {
                  number: '01',
                  title: 'Register',
                  text: 'A medicine receives a unique digital identity and its core details are recorded.',
                },
                {
                  number: '02',
                  title: 'Track',
                  text: 'Supply-chain activity and status changes create a transparent journey for each record.',
                },
                {
                  number: '03',
                  title: 'Verify',
                  text: 'A QR-based verification process helps check whether a medicine matches its registered record.',
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className={`p-7 transition ${sectionBg} hover:${softBg}`}
                >
                  <p
                    className={`font-display text-sm font-bold ${accent}`}
                  >
                    {item.number}
                  </p>

                  <h3
                    className={`mt-12 font-display text-xl font-bold ${mainText}`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`mt-3 text-sm leading-7 ${secondaryText}`}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>


          {/* TECHNOLOGY */}
          <section className="mt-16 grid gap-4 md:grid-cols-[.8fr_1.2fr]">
            <div
              className={`rounded-3xl border p-7 ${border} ${sectionBg}`}
            >
              <p
                className={`text-xs font-bold uppercase tracking-[.18em] ${accent}`}
              >
                Technology
              </p>

              <p
                className={`mt-5 font-display text-2xl font-bold leading-8 ${mainText}`}
              >
                A connected layer
                <br />
                for medicine data.
              </p>

              <p
                className={`mt-4 text-sm leading-7 ${secondaryText}`}
              >
                MedChain combines application services, database records,
                blockchain data, and QR verification into a single workflow.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ['React', 'Interface'],
                ['Node.js', 'API layer'],
                ['MongoDB', 'Data storage'],
                ['Ethereum', 'Blockchain'],
                ['QR', 'Verification'],
                ['Razorpay', 'Payments'],
              ].map(([name, description]) => (
                <div
                  key={name}
                  className={`rounded-2xl border p-5 transition ${border} ${sectionBg} hover:border-[var(--primary)]`}
                >
                  <p className={`font-semibold ${mainText}`}>
                    {name}
                  </p>

                  <p className={`mt-1 text-xs ${mutedText}`}>
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </section>


          {/* TEAM */}
          <section className="mt-20">
            <div className="mb-8">
              <p
                className={`text-xs font-bold uppercase tracking-[.2em] ${accent}`}
              >
                The team
              </p>

              <h2
                className={`mt-3 font-display text-3xl font-bold md:text-4xl ${mainText}`}
              >
                Built as one system.
              </h2>

              <p
                className={`mt-3 max-w-2xl text-sm leading-7 ${secondaryText}`}
              >
                Three disciplines, one connected product.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['Hrushikesh Kamble', 'Frontend', 'H'],
                ['Inaya Khan', 'Backend', 'I'],
                ['Siddhesh Kulkarni', 'Blockchain', 'S'],
              ].map(([name, role, initial]) => (
                <div
                  key={name}
                  className={`group rounded-3xl border p-6 transition hover:-translate-y-1 ${border} ${sectionBg} hover:border-[var(--primary)]`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-2xl bg-[var(--primary)] font-display text-lg font-bold text-white`}
                    >
                      {initial}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${mutedText} ${border}`}
                    >
                      {role}
                    </span>
                  </div>

                  <p
                    className={`mt-10 font-display text-lg font-bold ${mainText}`}
                  >
                    {name}
                  </p>

                  <p
                    className={`mt-2 text-sm leading-6 ${secondaryText}`}
                  >
                    Contributing to the architecture and experience of
                    the MedChain network.
                  </p>
                </div>
              ))}
            </div>
          </section>


          {/* CLOSING */}
          <section
            className={`mt-16 rounded-3xl border p-8 md:p-10 ${border} ${accentBg}`}
          >
            <p
              className={`max-w-3xl font-display text-2xl font-semibold leading-9 md:text-3xl ${mainText}`}
            >
              Better visibility starts with knowing where a medicine came
              from, where it has been, and what the network says about it.
            </p>
          </section>

        </main>
      </div>
    )
  }


  return (
    <div
      className={`grain min-h-screen overflow-hidden transition-colors duration-300 ${pageBg}`}
    >

      {/* HEADER */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-7">
        <Logo dark={isDark} />

        <nav
          className={`hidden items-center gap-8 text-sm md:flex ${secondaryText}`}
        >
          <a
            href="#network"
            className={`transition hover:text-[var(--primary)]`}
          >
            Network
          </a>

          <button
            onClick={() => setAbout(true)}
            className={`transition hover:text-[var(--primary)]`}
          >
            About
          </button>

          <a
            href="mailto:hello@medchain.app"
            className={`transition hover:text-[var(--primary)]`}
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-2">

          {/* THEME TOGGLE */}
          <button
            type="button"
            onClick={onToggleTheme}
            className={`grid h-10 w-10 place-items-center rounded-xl border transition ${toggleButtonClass}`}
            aria-label={
              isDark
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
          >
            {isDark ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <circle cx="12" cy="12" r="4" />
                <path
                  strokeLinecap="round"
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                />
              </svg>
            )}
          </button>

          <Button
            variant={isDark ? 'dark' : 'ghost'}
            onClick={onAdmin}
          >
            Super Admin
          </Button>

          <Button
            variant="mint"
            className="hidden sm:block"
            onClick={onSignup}
          >
            Create account
          </Button>
        </div>
      </header>


      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-10">

        {/* HERO */}
        <section className="grid gap-14 lg:grid-cols-[1fr_.9fr] lg:items-center lg:pt-14">

          {/* LEFT */}
          <div>
            <div
              className={`mb-7 inline-flex items-center gap-3 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[.2em] ${border} ${accentBg} ${accent}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
              Medicine traceability network
            </div>

            <h1 className="max-w-4xl font-display text-6xl font-bold leading-[.92] tracking-[-.04em] md:text-8xl">
              Every dose
              <br />
              has a
              <br />
              <span className={accent}>
                story.
              </span>
            </h1>

            <p
              className={`mt-8 max-w-xl text-lg leading-8 ${secondaryText}`}
            >
              MedChain connects medicine registration, supply-chain
              tracking, QR verification, and blockchain records in one
              secure network.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">

              <button
                onClick={onSignup}
                className="rounded-xl bg-[var(--primary)] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--primary-dark)]"
              >
                Enter the network
              </button>

              <button
                onClick={() => setAbout(true)}
                className={`rounded-xl border px-5 py-3.5 text-sm font-semibold transition ${border} ${secondaryText} hover:bg-[var(--surface)] hover:text-[var(--text-main)]`}
              >
                How MedChain works →
              </button>

            </div>

            <div
              className={`mt-12 grid max-w-xl grid-cols-3 border-y py-5 ${border}`}
            >
              <div>
                <p className={`font-display text-2xl font-bold ${mainText}`}>
                  01
                </p>

                <p
                  className={`mt-1 text-[10px] font-bold uppercase tracking-[.16em] ${mutedText}`}
                >
                  Digital identity
                </p>
              </div>

              <div className={`border-l pl-5 ${border}`}>
                <p className={`font-display text-2xl font-bold ${mainText}`}>
                  24/7
                </p>

                <p
                  className={`mt-1 text-[10px] font-bold uppercase tracking-[.16em] ${mutedText}`}
                >
                  Traceability
                </p>
              </div>

              <div className={`border-l pl-5 ${border}`}>
                <p className={`font-display text-2xl font-bold ${mainText}`}>
                  QR
                </p>

                <p
                  className={`mt-1 text-[10px] font-bold uppercase tracking-[.16em] ${mutedText}`}
                >
                  Verification
                </p>
              </div>
            </div>
          </div>


          {/* RIGHT — DIGITAL MEDICINE RECORD */}
          <div
            id="network"
            className="relative mx-auto w-full max-w-xl"
          >

            {isDark && (
              <>
                <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--primary)]/5 blur-3xl" />

                <div className="absolute left-1/2 top-1/2 h-[88%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-[var(--primary)]/20 to-transparent" />

                <div className="absolute left-1/2 top-1/2 h-px w-[88%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[var(--primary)]/15 to-transparent" />
              </>
            )}

            <div
              className={`relative rounded-[32px] border p-3 shadow-2xl ${border} ${sectionBg}`}
            >

              {/* TOP BAR */}
              <div
                className={`flex items-center justify-between border-b px-5 py-4 ${border}`}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />

                  <span
                    className={`text-[10px] font-bold uppercase tracking-[.18em] ${mutedText}`}
                  >
                    Live network
                  </span>
                </div>

                <span
                  className={`font-mono text-[10px] ${mutedText}`}
                >
                  MC / 001
                </span>
              </div>


              {/* MEDICINE CARD */}
              <div
                className={`m-3 rounded-3xl p-6 shadow-xl md:p-7 ${sectionBg} border ${border}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-[.18em] ${mutedText}`}
                    >
                      Digital medicine record
                    </p>

                    <h2
                      className={`mt-3 font-display text-3xl font-bold ${mainText}`}
                    >
                      Medicine ID
                    </h2>

                    <p
                      className={`mt-1 font-mono text-sm ${secondaryText}`}
                    >
                      MED-8F92A7C1
                    </p>
                  </div>

                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--primary)] text-xl text-white">
                    ✚
                  </div>
                </div>


                <div className="mt-7 grid grid-cols-2 gap-3">

                  <div
                    className={`rounded-2xl p-4 ${softBg}`}
                  >
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wider ${mutedText}`}
                    >
                      Status
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />

                      <p className={`text-sm font-bold ${mainText}`}>
                        Verified
                      </p>
                    </div>
                  </div>

                  <div
                    className={`rounded-2xl p-4 ${softBg}`}
                  >
                    <p
                      className={`text-[10px] font-bold uppercase tracking-wider ${mutedText}`}
                    >
                      Record
                    </p>

                    <p className={`mt-2 text-sm font-bold ${mainText}`}>
                      On-chain
                    </p>
                  </div>

                </div>


                {/* JOURNEY */}
                <div className="mt-6">
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[.16em] ${mutedText}`}
                  >
                    Journey
                  </p>

                  <div className="relative mt-5">
                    <div
                      className={`absolute left-3 top-2 h-px w-[calc(100%-24px)] ${border}`}
                    />

                    <div className="relative grid grid-cols-4">
                      {[
                        ['01', 'Made'],
                        ['02', 'Moved'],
                        ['03', 'Stored'],
                        ['04', 'Verified'],
                      ].map(([number, label], index) => (
                        <div
                          key={number}
                          className="text-center"
                        >
                          <div
                            className={`mx-auto grid h-6 w-6 place-items-center rounded-full border-2 ${index === 3
                              ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                              : `border-[var(--border)] ${sectionBg} ${mutedText}`
                              }`}
                          >
                            <span className="text-[8px] font-bold">
                              {number}
                            </span>
                          </div>

                          <p
                            className={`mt-2 text-[10px] font-bold ${secondaryText}`}
                          >
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>


                <div
                  className={`mt-7 flex items-center justify-between rounded-2xl bg-[var(--primary)] px-4 py-3.5 text-white`}
                >
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[.16em] text-white/60">
                      Verification
                    </p>

                    <p className="mt-1 text-xs font-semibold">
                      QR identity matched
                    </p>
                  </div>

                  <span className="rounded-lg bg-white/15 px-3 py-2 text-[10px] font-bold text-white">
                    AUTHENTIC
                  </span>
                </div>

              </div>
            </div>


            {/* FLOATING NETWORK NODES */}

            <div
              className={`absolute -left-3 top-16 hidden rounded-2xl border px-4 py-3 shadow-xl sm:block ${border} ${sectionBg}`}
            >
              <p
                className={`text-[9px] uppercase tracking-wider ${mutedText}`}
              >
                Blockchain
              </p>

              <p
                className={`mt-1 text-xs font-bold ${accent}`}
              >
                Connected
              </p>
            </div>


            <div
              className={`absolute -right-3 bottom-16 hidden rounded-2xl border px-4 py-3 shadow-xl sm:block ${border} ${sectionBg}`}
            >
              <p
                className={`text-[9px] uppercase tracking-wider ${mutedText}`}
              >
                Network
              </p>

              <p
                className={`mt-1 text-xs font-bold ${mainText}`}
              >
                4 roles active
              </p>
            </div>

          </div>
        </section>


        {/* ROLE ACCESS */}
        <section
          className={`mt-24 border-t pt-12 ${border}`}
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>
              <p
                className={`text-xs font-bold uppercase tracking-[.2em] ${accent}`}
              >
                Access the network
              </p>

              <h2
                className={`mt-3 font-display text-3xl font-bold ${mainText}`}
              >
                One system. Four perspectives.
              </h2>
            </div>

            <p
              className={`max-w-md text-sm leading-6 ${secondaryText}`}
            >
              Choose the workspace that matches your role in the medicine
              journey.
            </p>
          </div>


          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role, index) => (
              <button
                key={role}
                onClick={() => onRole(role)}
                className={`group rounded-2xl border p-5 text-left transition duration-200 hover:-translate-y-1 ${border} ${sectionBg} hover:border-[var(--primary)] hover:bg-[var(--surface-soft)]`}
              >
                <div className="flex items-start justify-between">

                  <span
                    className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--primary)] font-bold text-white"
                  >
                    {roleMeta[role].mark}
                  </span>

                  <span
                    className={`font-mono text-[10px] ${mutedText}`}
                  >
                    0{index + 1}
                  </span>
                </div>

                <p
                  className={`mt-8 font-display font-bold ${mainText}`}
                >
                  {role}
                </p>

                <p
                  className={`mt-1 text-xs ${secondaryText}`}
                >
                  {roleMeta[role].title}
                </p>

                <div className="mt-5 flex items-center justify-between text-xs">
                  <span className={mutedText}>
                    Open workspace
                  </span>

                  <span
                    className={`transition group-hover:translate-x-1 ${accent}`}
                  >
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>


        {/* BOTTOM STATEMENT */}
        <section className="mt-20 grid gap-4 md:grid-cols-[1.4fr_.6fr]">

          <div
            className={`rounded-3xl border p-7 md:p-9 ${border} ${sectionBg}`}
          >
            <p
              className={`max-w-3xl font-display text-2xl font-semibold leading-9 md:text-3xl ${mainText}`}
            >
              The goal isn't simply to store medicine data.
              <span className={mutedText}>
                {' '}
                It's to make the journey visible.
              </span>
            </p>
          </div>

          <div
            className={`rounded-3xl border p-7 ${border} ${accentBg}`}
          >
            <p
              className={`text-xs font-bold uppercase tracking-[.18em] ${accent}`}
            >
              MedChain
            </p>

            <p
              className={`mt-5 text-sm leading-7 ${secondaryText}`}
            >
              Registration
              <br />
              Supply-chain tracking
              <br />
              QR verification
              <br />
              Blockchain records
            </p>
          </div>

        </section>

      </main>
    </div>
  )
}

function Auth({
  mode,
  role,
  onBack,
  onLogin,
  onSignup,
  theme,
  onToggleTheme,
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState(
    role || 'Manufacturer'
  )
  const [error, setError] = useState('')

  const submit = () => {
    if (!email || !password) {
      return setError('Email and password are required.')
    }

    if (role === adminRole) {
      if (email !== 'sadmin' || password !== 'sadmin') {
        return setError('Invalid Super Admin credentials.')
      }

      onLogin({ email, role: adminRole })
      return
    }

    const users = JSON.parse(
      localStorage.getItem('medchain-users') || '[]'
    )

    if (mode === 'signup') {
      if (
        users.some(
          (item) =>
            item.email.toLowerCase() === email.toLowerCase()
        )
      ) {
        return setError(
          'An account with this email already exists.'
        )
      }

      const next = [
        ...users,
        {
          email,
          password,
          role: selectedRole,
          id: Date.now(),
        },
      ]

      localStorage.setItem(
        'medchain-users',
        JSON.stringify(next)
      )

      onSignup(email, password, selectedRole)
    } else {
      const match = users.find(
        (item) =>
          item.email.toLowerCase() === email.toLowerCase() &&
          item.password === password &&
          item.role === role
      )

      if (!match) {
        return setError(
          'Those credentials do not match this role.'
        )
      }

      onLogin(match)
    }
  }

  const currentRole = role || selectedRole

  return (
    <div className="min-h-screen bg-[var(--page-bg)] text-[var(--text-main)]">
      <div className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">

        {/* =====================================================
          LEFT — MEDCHAIN IDENTITY
          ===================================================== */}

        <section className="relative hidden overflow-hidden bg-[#4F7189] lg:flex">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full border border-[#8fb79b]/20" />
            <div className="absolute bottom-[-160px] right-[-100px] h-96 w-96 rounded-full border border-[#8fb79b]/10" />
          </div>

          <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">

            <Logo dark />

            <div className="max-w-md">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-xs font-semibold text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8fb79b]" />
                Secure healthcare network
              </div>

              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Secure medicine.
                <br />
                <span className="text-[#9fc4a8]">
                  Verified journeys.
                </span>
              </h1>

              <p className="mt-6 max-w-sm text-sm leading-7 text-slate-300">
                MedChain connects every stage of a medicine's journey,
                helping participants verify, track and manage medicines
                through a trusted digital record.
              </p>

              <div className="mt-10 grid gap-3">

                {/* BLOCKCHAIN */}
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.035] px-4 py-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#8fb79b]/10 text-[#9fc4a8]">
                    ✓
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Blockchain verified
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Medicine records can be checked against the chain.
                    </p>
                  </div>
                </div>

                {/* QR */}
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.035] px-4 py-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#8fb79b]/10 text-[#9fc4a8]">
                    ◫
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      QR verification
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Verify a medicine using its digital identity.
                    </p>
                  </div>
                </div>

                {/* SUPPLY CHAIN */}
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.035] px-4 py-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#8fb79b]/10 text-[#9fc4a8]">
                    ↗
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Supply-chain tracking
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Follow medicines across authorized network roles.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <p className="text-xs text-slate-500">
              MedChain Supply Chain Tracking System
            </p>

          </div>
        </section>


        {/* =====================================================
          RIGHT — AUTH
          ===================================================== */}

        <section className="flex min-h-screen flex-col bg-[var(--page-bg)]">

          {/* ===================================================
            TOP BAR
            =================================================== */}

          <div className="flex items-center justify-between px-6 py-6 md:px-10">

            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-main)]"
            >
              <span className="text-base">←</span>
              Back
            </button>

            <div className="lg:hidden">
              <Logo />
            </div>

            <div className="flex items-center gap-3">

              {/* Secure access — NO THEME TOGGLE HERE */}
              <div className="hidden lg:block">
                <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                  Secure access
                </span>
              </div>

            </div>
          </div>


          {/* ===================================================
            FORM AREA
            =================================================== */}

          <div className="flex flex-1 items-center justify-center px-5 pb-10 md:px-10">

            <div className="w-full max-w-md">

              {/* =================================================
                HEADER
                ================================================= */}

              <div className="mb-8">

                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--primary-soft)] text-xl font-bold text-[var(--primary-dark)]">
                  {currentRole === adminRole ? 'A' : '✚'}
                </div>

                <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--text-muted)]">
                  {currentRole} access
                </p>

                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--text-main)]">
                  {mode === 'signup'
                    ? 'Create your account'
                    : 'Welcome back'}
                </h2>

                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                  {mode === 'signup'
                    ? 'Create an account to access your MedChain workspace.'
                    : 'Sign in to continue to your MedChain workspace.'}
                </p>

              </div>


              {/* =================================================
                FORM CARD
                ================================================= */}

              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_16px_40px_rgba(15,23,42,.06)] md:p-8">

                {/* =================================================
                              ROLE
                    ================================================= */}


                {mode === 'signup' && (
                  <div className="mb-5">s
                    <label
                      htmlFor="signup-role"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider"
                      style={{ color: 'var(--text-main)' }}
                    >
                      Role
                    </label>
                    <select
                      id="signup-role"
                      value={selectedRole}
                      onChange={(e) => {
                        setSelectedRole(e.target.value)
                        setError('')
                      }}
                      className="w-full rounded-xl border px-4 py-3 text-sm font-semibold outline-none"
                      style={{
                        display: 'block',
                        width: '100%',
                        minHeight: '48px',
                        backgroundColor: theme === 'dark' ? '#1E293B' : '#FFFFFF',
                        color: theme === 'dark' ? '#F8FAFC' : '#1F2937',
                        border: `1px solid ${theme === 'dark' ? '#475569' : '#D1D5DB'
                          }`,
                        opacity: 1,
                        WebkitAppearance: 'menulist',
                        appearance: 'auto',
                        colorScheme: theme === 'dark' ? 'dark' : 'light',
                      }}
                    >
                      <option value="Manufacturer">Manufacturer</option>
                      <option value="Distributor">Distributor</option>
                      <option value="Retailer">Retailer</option>
                      <option value="Consumer">Consumer</option>
                    </select>
                  </div>
                )}
                {/* =================================================
                  EMAIL / USERNAME + PASSWORD
                  ================================================= */}

                <div className="space-y-5">

                  {/* EMAIL / USERNAME */}

                  <div>

                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                      {role === adminRole
                        ? 'Username'
                        : 'Email address'}
                    </label>

                    <input
                      type={role === adminRole ? 'text' : 'email'}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError('')
                      }}
                      placeholder={
                        role === adminRole
                          ? 'Enter username'
                          : 'you@example.com'
                      }
                      className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3.5 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                    />

                  </div>


                  {/* PASSWORD */}

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                        Password
                      </label>

                      <span className="text-[11px] text-[var(--text-muted)]">
                        Required
                      </span>

                    </div>

                    <div className="relative">

                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setError('')
                        }}
                        placeholder="Enter your password"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            submit()
                          }
                        }}
                        className="w-full rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3.5 pr-12 text-sm text-[var(--text-main)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10"
                      />

                      {/* SHOW / HIDE PASSWORD */}

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="absolute right-0 top-0 flex h-full w-12 items-center justify-center text-[var(--text-muted)] transition hover:text-[var(--text-main)]"
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >

                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 3l18 18M10.58 10.58a2 2 0 002.84 2.84M9.88 4.24A10.94 10.94 0 0112 4c5 0 9.27 3.11 10.5 8a10.9 10.9 0 01-4.02 5.48M6.61 6.61C4.96 7.74 3.73 9.42 3.5 12c.23 2.58 1.46 4.26 3.11 5.39A10.94 10.94 0 0012 20c1.03 0 2.03-.14 2.97-.4"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.46 12S5.7 5 12 5s9.54 7 9.54 7-3.24 7-9.54 7-9.54-7-9.54-7z"
                            />
                            <circle cx="12" cy="12" r="2.8" />
                          </svg>
                        )}

                      </button>

                    </div>

                  </div>

                </div>


                {/* =================================================
                  ERROR
                  ================================================= */}

                {error && (
                  <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-700">
                    {error}
                  </div>
                )}


                {/* =================================================
                  SUBMIT
                  ================================================= */}

                <button
                  type="button"
                  onClick={submit}
                  className="mt-6 w-full rounded-xl bg-[var(--primary-dark)] px-4 py-3.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(15,23,42,.12)] transition hover:opacity-90"
                >
                  {mode === 'signup'
                    ? 'Create account'
                    : 'Sign in'}
                </button>


                {/* =================================================
                  SIGNUP / LOGIN SWITCH
                  ================================================= */}

                {role !== adminRole && (
                  <div className="mt-6 text-center">

                    <span className="text-sm text-[var(--text-muted)]">
                      {mode === 'signup'
                        ? 'Already have an account?'
                        : "Don't have an account?"}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setError('')
                        onSignup()
                      }}
                      className="ml-1 text-sm font-bold text-[var(--primary-dark)] hover:underline"
                    >
                      {mode === 'signup'
                        ? 'Sign in'
                        : 'Create one'}
                    </button>

                  </div>
                )}

              </div>


              {/* =================================================
                FOOTER NOTE
                ================================================= */}

              <p className="mt-6 text-center text-[11px] leading-5 text-[var(--text-muted)]">
                Access is limited to registered MedChain network users.
              </p>

            </div>
          </div>

        </section>
      </div>
    </div>
  )
}



function Scanner({ id, onScan }) {
  const scannerRef = useRef(null)

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      id,
      {
        fps: 10,
        qrbox: {
          width: 220,
          height: 220,
        },
      },
      false
    )

    scannerRef.current = scanner

    scanner.render(
      (value) => {
        try {
          onScan(JSON.parse(value))
        } catch {
          onScan({ data: value })
        }

        scanner.clear().catch(() => { })
      },
      () => { }
    )

    return () => {
      scanner.clear().catch(() => { })
    }
  }, [id, onScan])

  return (
    <div
      id={id}
      className="qr-reader overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
    />
  )
}
function MedicineRow({ medicine, onClick }) {
  const expiry = medicine.expiryDate
    ? new Date(medicine.expiryDate)
    : null

  const expired = expiry && expiry < new Date()

  return (
    <button
      onClick={onClick}
      className="grid w-full grid-cols-[1fr_auto] gap-4 border-b border-slate-100 px-5 py-4 text-left last:border-0 hover:bg-slate-50 md:grid-cols-[1.4fr_1fr_.8fr_.7fr] md:items-center"
    >
      <div>
        <p className="font-semibold text-ink transition hover:text-emerald-600">
          {medicine.name}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Batch {medicine.batchNumber} · ID {medicine.blockchainId}
        </p>
      </div>

      <p className="hidden text-sm text-slate-500 md:block">
        {medicine.manufacturer || 'Network stock'}
      </p>

      <p className="text-right text-sm font-semibold text-slate-700 md:text-left">
        {medicine.quantity || 0} units
      </p>

      <span
        className={`col-start-2 row-start-1 rounded-full px-2.5 py-1 text-center text-[11px] font-bold md:col-auto md:row-auto ${expired
          ? 'bg-rose-50 text-rose-600'
          : 'bg-emerald-50 text-emerald-600'
          }`}
      >
        {expired ? 'Expired' : 'Active'}
      </span>
    </button>
  )
} function Layout({ user, children, onLogout }) {
  const meta = roleMeta[user.role]

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white px-5 py-6 lg:flex">
        <Logo />

        <div className="mt-10">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[.18em] text-slate-400">
            Workspace
          </p>

          <div className="mt-3 rounded-2xl bg-ink p-4 text-white shadow-[0_8px_24px_rgba(15,23,42,.08)]">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint font-bold text-ink">
                {meta.mark}
              </span>

              <div className="min-w-0">
                <p className="font-display text-sm font-bold">
                  {meta.title}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Active workspace
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs leading-5 text-slate-400">
              {meta.text}
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <div className="mb-4 h-px bg-slate-100" />

          <div className="mb-3 rounded-xl bg-slate-50 px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Signed in as
            </p>
            <p className="mt-1 truncate text-xs font-semibold text-slate-600">
              {user.email}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-ink"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100">
              ↪
            </span>
            Sign out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-10">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
              {user.role} workspace
            </p>

            <p className="mt-1 truncate text-sm text-slate-500">
              Good to see you,{' '}
              <span className="font-semibold text-ink">
                {user.email}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              System operational
            </span>

            <button
              onClick={onLogout}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-ink lg:hidden"
            >
              ↪
            </button>

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink font-bold text-mint shadow-sm">
              {user.email[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-5 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}
function Heading({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-600">
        {eyebrow}
      </p>

      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
        {title}
      </h1>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
        {description}
      </p>
    </div>
  )
}

function Empty({ text }) {
  return (
    <div className="p-12 text-center text-sm text-slate-400">
      {text}
    </div>
  )
}

function Notice({ title, data, onClear }) {
  return (
    <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-emerald-800">
          ✓ {title}
        </p>

        <button
          onClick={onClear}
          className="text-xs font-bold text-emerald-700"
        >
          Clear
        </button>
      </div>

      <div className="mt-3 grid gap-2 text-xs text-emerald-900">
        {Object.entries(data)
          .slice(0, 6)
          .map(([key, value]) => (
            <p key={key}>
              <span className="font-bold capitalize">
                {key}:{' '}
              </span>
              {String(value)}
            </p>
          ))}
      </div>
    </div>
  )
}

function Manufacturer({ user }) {
  const [medicines, setMedicines] = useState([])
  const [created, setCreated] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const [scanned, setScanned] = useState(null)
  const [selectedMedicine, setSelectedMedicine] = useState(null)

  const [form, setForm] = useState({
    name: '',
    batch: '',
    manufacturingDate: '',
    expiryDate: '',
    chemicalComponents: '',
    description: '',
    storageConditions: '',
    dosage: '',
    price: '',
    quantity: '',
  })

  const update = (key) => (event) => {
    setForm({
      ...form,
      [key]: event.target.value,
    })
  }

  useEffect(() => {
    fetch(`${API_URL}/medicines`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Medicines:', data)
        setMedicines(data)

        const userMedicines =
          filterUserMedicines(data)

        setOrders(userMedicines)
        setInventory(userMedicines)
      })
      .catch(() => { })
  }, [])

  const register = async () => {
    if (
      !form.name ||
      !form.batch ||
      !form.expiryDate ||
      !form.chemicalComponents ||
      !form.description ||
      !form.storageConditions ||
      !form.dosage ||
      !form.price ||
      !form.quantity
    ) {
      return setError(
        'Please fill in all required medicine details before registering.'
      )
    }

    setLoading(true)
    setError('')

    const medicine = {
      name: form.name,
      batchNumber: form.batch,
      manufacturer: user.email,
      manufacturingDate:
        form.manufacturingDate ||
        new Date().toISOString(),
      expiryDate: form.expiryDate,
      chemicalComponents:
        form.chemicalComponents,
      description: form.description,
      storageConditions:
        form.storageConditions,
      dosage: form.dosage,
      price: Number(form.price) || 0,
      quantity: Number(form.quantity) || 0,
    }

    try {
      const response = await fetch(
        `${API_URL}/medicines/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(medicine),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Registration failed'
        )
      }

      setCreated(data.medicine)

      setMedicines([
        data.medicine,
        ...medicines,
      ])

      setForm({
        name: '',
        batch: '',
        manufacturingDate: '',
        expiryDate: '',
        chemicalComponents: '',
        description: '',
        storageConditions: '',
        dosage: '',
        price: '',
        quantity: '',
      })
    } catch (err) {
      setError(
        err.message ||
        'Network error. Is the backend running?'
      )
    } finally {
      setLoading(false)
    }
  }

  const activeStock = medicines.filter(
    (medicine) =>
      medicine.status !== 'Sold' &&
      medicine.status !== 'Expired' &&
      medicine.status !== 'Recalled'
  ).length

  const inTransit = medicines.filter(
    (medicine) =>
      medicine.status === 'InTransit'
  ).length

  return (
    <>
      <Heading
        eyebrow="Manufacturer"
        title="Production control"
        description="Register a new batch and create its chain-of-custody identity."
      />

      {/* Overview cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.04)]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Registered batches
          </p>

          <p className="mt-3 font-display text-3xl font-bold text-ink">
            {medicines.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Total medicine records
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.04)]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active stock
          </p>

          <p className="mt-3 font-display text-3xl font-bold text-emerald-600">
            {activeStock}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Active medicine records
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.04)]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            In transit
          </p>

          <p className="mt-3 font-display text-3xl font-bold text-sky-600">
            {inTransit}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Batches currently moving
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.04)]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Network status
          </p>

          <p className="mt-3 flex items-center gap-2 font-display text-2xl font-bold text-emerald-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Operational
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Ready for registration
          </p>
        </div>
      </div>

      {/* Main manufacturer workspace */}
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        {/* Registration form */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,.04)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
                Production entry
              </p>

              <h2 className="mt-1 font-display text-xl font-bold text-ink">
                Register a medicine
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create a new medicine record and generate
                its traceable identity.
              </p>
            </div>

            <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              New batch
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rose-100 font-bold">
                !
              </span>

              <div>
                <p className="font-semibold">
                  Registration issue
                </p>

                <p className="mt-0.5 text-xs leading-5 text-rose-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="mt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Medicine information
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['name', 'Medicine name *'],
                ['batch', 'Batch number *'],
                [
                  'manufacturingDate',
                  'Manufacturing date',
                  'date',
                ],
                [
                  'expiryDate',
                  'Expiry date *',
                  'date',
                ],
              ].map(
                ([key, label, type = 'text']) => (
                  <Field
                    key={key}
                    label={label}
                    type={type}
                    value={form[key]}
                    onChange={update(key)}
                  />
                )
              )}
            </div>
          </div>

          <div className="mt-7 border-t border-slate-100 pt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Product details
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {
                [
                  [
                    'chemicalComponents',
                    'Chemical components *',
                  ],
                  ['description', 'Description *'],
                  [
                    'storageConditions',
                    'Storage conditions *',
                  ],
                  ['dosage', 'Dosage *'],
                ].map(
                  ([key, label]) => (
                    <Field
                      key={key}
                      label={label}
                      value={form[key]}
                      onChange={update(key)}
                    />
                  )
                )}
            </div>
          </div>

          <div className="mt-7 border-t border-slate-100 pt-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Commercial information
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Unit price *"
                type="number"
                value={form.price}
                onChange={update('price')}
              />

              <Field
                label="Quantity *"
                type="number"
                value={form.quantity}
                onChange={update('quantity')}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
            <Button
              variant="mint"
              onClick={register}
              disabled={loading}
            >
              {loading
                ? 'Registering...'
                : 'Register medicine'}{' '}
              →
            </Button>

            <Button
              variant="ghost"
              onClick={() =>
                setShowScanner(!showScanner)
              }
            >
              {showScanner
                ? 'Close scanner'
                : 'Scan a batch'}
            </Button>
          </div>

          {/* Scanner */}
          {showScanner && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4">
                <p className="font-semibold text-ink">
                  Batch scanner
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Scan an existing medicine QR code.
                </p>
              </div>

              <div className="max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white p-3">
                <Scanner
                  id="manufacturer-scanner"
                  onScan={setScanned}
                />
              </div>
            </div>
          )}

          {scanned && (
            <div className="mt-5">
              <Notice
                title="Scanned batch"
                data={scanned}
                onClear={() =>
                  setScanned(null)
                }
              />
            </div>
          )}
        </section>

        {/* QR / batch identity panel */}
        <section className="overflow-hidden rounded-2xl bg-ink p-6 text-white shadow-[0_8px_24px_rgba(15,23,42,.12)]">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-mint">
            Batch identity
          </p>

          {created ? (
            <>
              <div className="mt-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-2xl font-bold">
                      {created.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      Batch {created.batchNumber}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] font-bold text-mint">
                    Registered
                  </span>
                </div>
              </div>

              <div className="mt-7 rounded-2xl bg-white p-5">
                <div className="mb-4 text-center">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Scan to identify
                  </p>
                </div>

                <QRCodeSVG
                  value={created.qrCodeData}
                  size={200}
                  className="mx-auto h-auto max-w-full"
                />
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Blockchain ID
                </p>

                <p className="mt-2 break-all font-mono text-xs leading-5 text-slate-300">
                  {created.blockchainId}
                </p>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                This QR identity can be used to trace and
                verify the medicine throughout the supply
                chain.
              </p>
            </>
          ) : (
            <div className="flex min-h-[420px] flex-col justify-end">
              <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/5 text-3xl text-mint">
                ⌁
              </div>

              <h2 className="mt-7 font-display text-2xl font-bold">
                Your QR appears here.
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                Register a medicine to create its
                scannable identity and blockchain record.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-slate-500">
                    Identity
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    QR code
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-slate-500">
                    Ledger
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    Blockchain
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Registered medicines */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,.04)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
              Medicine registry
            </p>

            <h2 className="mt-1 font-display text-xl font-bold text-ink">
              Registered medicines
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {medicines.length} records in the network
            </p>
          </div>

          <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
            Latest first
          </span>
        </div>

        {medicines.length ? (
          medicines.map((item) => (
            <MedicineRow
              key={item._id || item.blockchainId}
              medicine={item}
              onClick={() => setSelectedMedicine(item)}
            />
          ))
        ) : (
          <Empty text="No medicines registered yet." />
        )}
      </section>
      {selectedMedicine && (
        <div
          className="fixed inset-0 z-30 grid place-items-center bg-ink/60 p-5 backdrop-blur-sm"
          onClick={() => setSelectedMedicine(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-600">
                  Medicine record
                </p>

                <h2 className="mt-2 font-display text-3xl font-bold text-ink">
                  {selectedMedicine.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Batch {selectedMedicine.batchNumber}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMedicine(null)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-lg text-slate-500 transition hover:bg-slate-200 hover:text-ink"
              >
                ×
              </button>
            </div>

            {/* QR + basic identity */}
            <div className="mt-7 grid gap-5 md:grid-cols-[220px_1fr]">
              {selectedMedicine.qrCodeData && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Medicine QR Code
                  </p>

                  <QRCodeSVG
                    value={selectedMedicine.qrCodeData}
                    size={180}
                    className="mx-auto h-auto max-w-full"
                  />
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Medicine ID
                  </p>

                  <p className="mt-2 break-all font-mono text-sm font-semibold text-ink">
                    {selectedMedicine.medicineId || '—'}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${selectedMedicine.status === 'Sold'
                      ? 'bg-slate-100 text-slate-700'
                      : selectedMedicine.status === 'Expired'
                        ? 'bg-amber-50 text-amber-700'
                        : selectedMedicine.status === 'Recalled'
                          ? 'bg-rose-50 text-rose-700'
                          : selectedMedicine.status === 'InTransit'
                            ? 'bg-sky-50 text-sky-700'
                            : 'bg-emerald-50 text-emerald-700'
                      }`}
                  >
                    ● {selectedMedicine.status || 'Manufactured'}
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Manufacturer
                  </p>

                  <p className="mt-2 break-all text-sm font-semibold text-ink">
                    {selectedMedicine.manufacturer || '—'}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Blockchain ID
                  </p>

                  <p className="mt-2 break-all font-mono text-xs font-semibold text-ink">
                    {selectedMedicine.blockchainId || '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Medicine information */}
            <div className="mt-7 border-t border-slate-100 pt-6">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
                Medicine information
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  [
                    'Chemical components',
                    selectedMedicine.chemicalComponents,
                  ],
                  [
                    'Description',
                    selectedMedicine.description,
                  ],
                  [
                    'Dosage',
                    selectedMedicine.dosage,
                  ],
                  [
                    'Storage conditions',
                    selectedMedicine.storageConditions,
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      {label}
                    </p>

                    <p className="mt-2 text-sm font-semibold leading-6 text-ink">
                      {value || '—'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Production + commercial information */}
            <div className="mt-7 border-t border-slate-100 pt-6">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
                Production & stock
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  [
                    'Manufactured',
                    selectedMedicine.manufacturingDate
                      ? new Date(
                        selectedMedicine.manufacturingDate
                      ).toLocaleDateString()
                      : '—',
                  ],
                  [
                    'Expires',
                    selectedMedicine.expiryDate
                      ? new Date(
                        selectedMedicine.expiryDate
                      ).toLocaleDateString()
                      : '—',
                  ],
                  [
                    'Unit price',
                    `₹${selectedMedicine.price || 0}`,
                  ],
                  [
                    'Quantity',
                    `${selectedMedicine.quantity || 0} units`,
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      {label}
                    </p>

                    <p className="mt-2 text-sm font-semibold text-ink">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="mt-7 w-full"
              onClick={() => setSelectedMedicine(null)}
            >
              Close record
            </Button>
          </div>
        </div>
      )}


    </>
  )
}


function SupplyDashboard({ user, retailer = false }) {
  const [medicines, setMedicines] = useState([])
  const [tab, setTab] = useState(
    retailer ? 'store' : 'available'
  )
  const [showOrder, setShowOrder] = useState(false)
  const [selected, setSelected] = useState(null)
  const [quantity, setQuantity] = useState('')
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)

  const filterUserMedicines = (data) => {
    return data.filter((m) =>
      retailer
        ? m.retailer === user.email
        : m.distributor === user.email
    )
  }

  useEffect(() => {
    fetch(`${API_URL}/medicines`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Medicines:', data)

        setMedicines(data)

        const userMedicines = filterUserMedicines(data)

        setOrders(userMedicines)
        setInventory(userMedicines)
      })
      .catch(() => { })
  }, [])

  const placeOrder = async () => {
    if (!selected || !quantity || !paymentDone) return

    setLoading(true)

    try {
      const body = {
        medicineId: selected._id,
        quantity: Number(quantity),
        orderDate: new Date().toISOString(),
        ...(retailer
          ? { retailer: user.email }
          : { distributor: user.email }),
      }

      const response = await fetch(
        `${API_URL}/medicines/order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )

      if (!response.ok) {
        throw new Error()
      }

      setShowOrder(false)
      setSelected(null)
      setQuantity('')
      setPaymentDone(false)

      const data = await fetch(
        `${API_URL}/medicines`
      ).then((res) => res.json())

      setMedicines(data)

      const userMedicines = filterUserMedicines(data)

      setOrders(userMedicines)
      setInventory(userMedicines)
    } catch {
      alert(
        'Could not place the order. Check the backend connection.'
      )
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (medicineId, status) => {
    setLoading(true)

    try {
      const response = await fetch(
        `${API_URL}/medicines/${medicineId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.error || 'Failed to update medicine status.'
        )
      }

      const data = await fetch(
        `${API_URL}/medicines`
      ).then((res) => res.json())

      setMedicines(data)

      const userMedicines = filterUserMedicines(data)

      setOrders(userMedicines)
      setInventory(userMedicines)
    } catch (error) {
      alert(
        error.message ||
        'Could not update the medicine status.'
      )
    } finally {
      setLoading(false)
    }
  }

  const tabs = retailer
    ? [
      ['store', 'Store inventory'],
      ['available', 'Available stock'],
      ['orders', 'My orders'],
      ['verify', 'Verify QR'],
    ]
    : [
      ['available', 'Available stock'],
      ['orders', 'My orders'],
      ['inventory', 'My inventory'],
    ]

  return (
    <>
      <Heading
        eyebrow={
          retailer
            ? 'Retail operations'
            : 'Distribution desk'
        }
        title={
          retailer
            ? 'Store inventory'
            : 'Move medicine with confidence'
        }
        description={
          retailer
            ? 'Keep shelf stock healthy and verify every batch before sale.'
            : 'Source medicine from manufacturers and track every order in motion.'
        }
      />

      {/* Dashboard summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.04)]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total medicines
          </p>

          <p className="mt-3 font-display text-3xl font-bold text-ink">
            {medicines.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Across the network
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.04)]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Available stock
          </p>

          <p className="mt-3 font-display text-3xl font-bold text-emerald-600">
            {medicines.filter(
              (medicine) =>
                medicine.status !== 'Sold' &&
                medicine.status !== 'Expired' &&
                medicine.status !== 'Recalled'
            ).length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Active medicine records
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.04)]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            In transit
          </p>

          <p className="mt-3 font-display text-3xl font-bold text-sky-600">
            {medicines.filter(
              (medicine) =>
                medicine.status === 'InTransit'
            ).length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Currently moving
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.04)]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            My records
          </p>

          <p className="mt-3 font-display text-3xl font-bold text-ink">
            {inventory.length}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Assigned to this account
          </p>
        </div>
      </div>

      {/* Main workspace */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,.04)]">

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto border-b border-slate-100 p-2">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${tab === id
                ? 'bg-ink text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100 hover:text-ink'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-5 md:p-7">

          {/* Inventory */}
          {(tab === 'store' || tab === 'inventory') && (
            <Inventory
              items={inventory}
              retailer={retailer}
              onOrder={() => setTab('available')}
              onStatusUpdate={updateStatus}
            />
          )}

          {/* Available stock */}
          {tab === 'available' && (
            <Catalog
              medicines={medicines}
              showOrder={showOrder}
              setShowOrder={setShowOrder}
              selected={selected}
              setSelected={setSelected}
              quantity={quantity}
              setQuantity={setQuantity}
              loading={loading}
              placeOrder={placeOrder}
              paymentDone={paymentDone}
              setPaymentDone={setPaymentDone}
            />
          )}

          {/* Orders */}
          {tab === 'orders' && (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
                    Activity
                  </p>

                  <h2 className="mt-1 font-display text-xl font-bold text-ink">
                    Order activity
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Track medicines associated with this account.
                  </p>
                </div>
              </div>

              {orders.length ? (
                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                  {orders.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-ink">
                          {item.name}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span>
                            Batch {item.batchNumber}
                          </span>

                          <span className="text-slate-300">
                            ·
                          </span>

                          <span>
                            {item.quantity || 0} units
                          </span>
                        </div>
                      </div>

                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${item.status === 'Stored'
                          ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                          : item.status === 'Sold'
                            ? 'border-slate-200 bg-slate-100 text-slate-700'
                            : item.status === 'Recalled'
                              ? 'border-rose-100 bg-rose-50 text-rose-700'
                              : item.status === 'Expired'
                                ? 'border-amber-100 bg-amber-50 text-amber-700'
                                : 'border-sky-100 bg-sky-50 text-sky-700'
                          }`}
                      >
                        {item.status || 'InTransit'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5">
                  <Empty text="No orders placed yet." />
                </div>
              )}
            </div>
          )}

          {/* QR verification */}
          {tab === 'verify' && (
            <Verify id="retailer-scanner" />
          )}

        </div>
      </div>
    </>
  )
}


function Inventory({ items, retailer, onOrder, onStatusUpdate }) {
  const [history, setHistory] = useState({})
  const [historyLoading, setHistoryLoading] = useState(null)
  const [comparison, setComparison] = useState({})
  const [comparisonLoading, setComparisonLoading] = useState(null)

  const loadBlockchainHistory = async (medicineId) => {
    setHistoryLoading(medicineId)

    try {
      const response = await fetch(
        `${API_URL}/medicines/${medicineId}/history`
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to fetch blockchain history.'
        )
      }

      setHistory((prev) => ({
        ...prev,
        [medicineId]: data.history || [],
      }))
    } catch (error) {
      alert(
        error.message ||
        'Could not load blockchain history.'
      )
    } finally {
      setHistoryLoading(null)
    }
  }

  const loadBlockchainComparison = async (medicineId) => {
    setComparisonLoading(medicineId)

    try {
      const response = await fetch(
        `${API_URL}/medicines/${medicineId}/blockchain`
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to compare blockchain data.'
        )
      }

      setComparison((prev) => ({
        ...prev,
        [medicineId]: data,
      }))
    } catch (error) {
      alert(
        error.message ||
        'Could not load blockchain comparison.'
      )
    } finally {
      setComparisonLoading(null)
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Stored':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100'
      case 'Sold':
        return 'bg-slate-100 text-slate-700 border border-slate-200'
      case 'InTransit':
        return 'bg-sky-50 text-sky-700 border border-sky-100'
      case 'Expired':
        return 'bg-amber-50 text-amber-700 border border-amber-100'
      case 'Recalled':
        return 'bg-rose-50 text-rose-700 border border-rose-100'
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200'
    }
  }

  return (
    <div>
      {/* Inventory heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
            Stock management
          </p>

          <h2 className="mt-1 font-display text-2xl font-bold text-ink">
            {retailer ? 'Store inventory' : 'My inventory'}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {items.length} active stock records
          </p>
        </div>

        <Button variant="ghost" onClick={onOrder}>
          + Place order
        </Button>
      </div>

      {items.length ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Table header */}
          <div className="hidden grid-cols-[1.5fr_1fr_.65fr_.8fr_.9fr] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[11px] font-bold uppercase tracking-[.16em] text-slate-400 md:grid">
            <span>Medicine</span>
            <span>Batch</span>
            <span>Stock</span>
            <span>Expiry</span>
            <span>Status</span>
          </div>

          {items.map((item) => {
            const status = item.status || 'Manufactured'

            return (
              <div
                key={item._id}
                className="border-b border-slate-200 last:border-0"
              >{/* Medicine row */}
                <div className="grid gap-4 px-5 py-5 md:grid-cols-[1.5fr_1fr_.65fr_.8fr_.9fr] md:items-center">
                  {/* Medicine */}
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 font-display text-sm font-bold text-emerald-700">
                      {item.name?.[0]?.toUpperCase() || 'M'}
                    </span>

                    <div>
                      <p className="font-semibold text-ink">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400 md:hidden">
                        Medicine
                      </p>
                    </div>
                  </div>

                  {/* Batch */}
                  <div>
                    <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600">
                      {item.batchNumber}
                    </span>

                    <p className="mt-1 text-xs text-slate-400 md:hidden">
                      Batch number
                    </p>
                  </div>

                  {/* Stock */}
                  <div>
                    <span className="inline-flex min-w-[48px] justify-center rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-bold text-emerald-700">
                      {item.quantity || 0}
                    </span>

                    <p className="mt-1 text-xs text-slate-400 md:hidden">
                      Units
                    </p>
                  </div>

                  {/* Expiry */}
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {item.expiryDate
                        ? new Date(
                          item.expiryDate
                        ).toLocaleDateString()
                        : '—'}
                    </p>

                    <p className="mt-1 text-xs text-slate-400 md:hidden">
                      Expiry date
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                        status
                      )}`}
                    >
                      <span className="mr-1.5">●</span>
                      {status}
                    </span>

                    <p className="mt-1 text-xs text-slate-400 md:hidden">
                      Current status
                    </p>
                  </div>
                </div>

                {/* Status actions */}
                {(item.status === 'InTransit' ||
                  item.status === 'Stored') && (
                    <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3">
                      <p className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Update status
                      </p>

                      {item.status === 'InTransit' && (
                        <Button
                          variant="mint"
                          onClick={() =>
                            onStatusUpdate(
                              item._id,
                              'Stored'
                            )
                          }
                        >
                          Mark as stored →
                        </Button>
                      )}

                      {item.status === 'Stored' && (
                        <Button
                          variant="mint"
                          onClick={() =>
                            onStatusUpdate(
                              item._id,
                              'Sold'
                            )
                          }
                        >
                          Mark as sold →
                        </Button>
                      )}
                    </div>
                  )}

                {/* Blockchain actions */}
                <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-5 py-3">
                  <p className="mr-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Blockchain
                  </p>

                  <Button
                    variant="ghost"
                    onClick={() =>
                      loadBlockchainHistory(item._id)
                    }
                    disabled={
                      historyLoading === item._id
                    }
                  >
                    {historyLoading === item._id
                      ? 'Loading history...'
                      : 'View history'}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() =>
                      loadBlockchainComparison(item._id)
                    }
                    disabled={
                      comparisonLoading === item._id
                    }
                  >
                    {comparisonLoading === item._id
                      ? 'Checking...'
                      : 'Check integrity'}
                  </Button>
                </div>

                {/* Blockchain history */}
                {history[item._id] && (
                  <div className="border-t border-slate-200 bg-slate-50 px-5 py-5">
                    <div className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink text-sm text-mint">
                        ⛓
                      </span>

                      <div>
                        <h3 className="font-semibold text-ink">
                          Blockchain History
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-400">
                          Recorded medicine events
                        </p>
                      </div>
                    </div>

                    {history[item._id].length ? (
                      <div className="mt-4 space-y-3">
                        {history[item._id].map(
                          (entry, index) => (
                            <div
                              key={index}
                              className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300"
                            >
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                                  <span className="font-semibold text-ink">
                                    {entry.status ||
                                      entry.action ||
                                      'Blockchain event'}
                                  </span>
                                </div>

                                <span className="text-xs text-slate-400">
                                  {entry.timestamp
                                    ? new Date(
                                      entry.timestamp
                                    ).toLocaleString()
                                    : ''}
                                </span>
                              </div>

                              {entry.location && (
                                <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2">
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Storage conditions
                                  </p>

                                  <p className="mt-1 text-sm text-slate-600">
                                    {entry.location}
                                  </p>
                                </div>
                              )}

                              {entry.transactionHash && (
                                <div className="mt-3">
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    Transaction hash
                                  </p>

                                  <p className="mt-1 break-all rounded-lg bg-slate-50 p-2.5 font-mono text-xs text-slate-500">
                                    {entry.transactionHash}
                                  </p>
                                </div>
                              )}

                              {entry.blockNumber !==
                                undefined && (
                                  <p className="mt-3 text-xs text-slate-400">
                                    Block number:{' '}
                                    <span className="font-semibold text-slate-600">
                                      {entry.blockNumber}
                                    </span>
                                  </p>
                                )}
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center">
                        <p className="text-sm font-semibold text-slate-600">
                          No blockchain history available.
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          No recorded events were returned for this medicine.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Blockchain comparison */}
                {comparison[item._id] && (
                  <div className="border-t border-slate-200 bg-slate-50 px-5 py-5">
                    <div className="flex items-center gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-sm text-mint">
                        ✓
                      </span>

                      <div>
                        <h3 className="font-semibold text-ink">
                          Database ↔ Blockchain Integrity
                        </h3>

                        <p className="text-xs text-slate-400">
                          Field-by-field verification
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                      {[
                        [
                          'Medicine ID',
                          comparison[item._id].database
                            ?.medicineId,
                          comparison[item._id].database
                            ?.blockchainId,
                        ],
                        [
                          'Medicine Name',
                          comparison[item._id].database
                            ?.name,
                          comparison[item._id].blockchain
                            ?.name,
                        ],
                        [
                          'Manufacturer',
                          comparison[item._id].database
                            ?.manufacturer,
                          comparison[item._id].blockchain
                            ?.manufacturer,
                        ],
                        [
                          'Batch Number',
                          comparison[item._id].database
                            ?.batchNumber,
                          item.batchNumber,
                        ],
                        [
                          'Manufacturing Date',
                          comparison[item._id].database
                            ?.manufacturingDate,
                          comparison[item._id].blockchain
                            ?.manufacturingDate,
                        ],
                        [
                          'Expiry Date',
                          comparison[item._id].database
                            ?.expiryDate,
                          comparison[item._id].blockchain
                            ?.expiryDate,
                        ],
                        [
                          'Status',
                          comparison[item._id].database
                            ?.status,
                          comparison[item._id].blockchain
                            ?.status,
                        ],
                        [
                          'Storage Conditions',
                          comparison[item._id].database
                            ?.storageConditions,
                          comparison[item._id].blockchain
                            ?.currentLocation,
                        ],
                      ].map(
                        ([
                          label,
                          databaseValue,
                          blockchainValue,
                        ]) => {
                          const match =
                            String(
                              databaseValue ?? ''
                            ) ===
                            String(
                              blockchainValue ?? ''
                            )

                          return (
                            <div
                              key={label}
                              className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-0"
                            >
                              <span className="text-sm font-medium text-slate-600">
                                {label}
                              </span>

                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-bold ${match
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-rose-50 text-rose-700'
                                  }`}
                              >
                                {match
                                  ? '✓ Match'
                                  : '✗ Mismatch'}
                              </span>
                            </div>
                          )
                        }
                      )}

                      <div className="mt-4 border-t border-slate-100 pt-4">
                        <p className="text-xs text-slate-400">
                          Blockchain network:{' '}
                          {comparison[item._id].database
                            ?.blockchainNetwork || '—'}
                        </p>

                        <p className="mt-1 break-all text-xs text-slate-400">
                          Transaction:{' '}
                          {comparison[item._id].database
                            ?.blockchainTransactionHash ||
                            '—'}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Block:{' '}
                          {comparison[item._id].database
                            ?.blockchainBlockNumber ??
                            '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="mt-6">
          <Empty text="No inventory items yet." />
        </div>
      )}
    </div>
  )
}
function Catalog({
  medicines,
  showOrder,
  setShowOrder,
  selected,
  setSelected,
  quantity,
  setQuantity,
  loading,
  placeOrder,
  paymentDone,
  setPaymentDone,
}) {
  const totalAmount =
    selected && quantity
      ? Number(selected.price || 0) * Number(quantity)
      : 0

  const handlePayment = async () => {
    if (!selected || !quantity) {
      alert('Please select a medicine and enter quantity.')
      return
    }

    const requestedQuantity = Number(quantity)

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity <= 0
    ) {
      alert('Please enter a valid quantity.')
      return
    }

    if (
      requestedQuantity >
      Number(selected.quantity || 0)
    ) {
      alert('Requested quantity exceeds available stock.')
      return
    }

    try {
      const response = await fetch(
        'http://localhost:5000/api/medicines/payment/create-order',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: totalAmount,
            medicineId: selected._id,
            quantity: requestedQuantity,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Failed to create payment order'
        )
      }

      const options = {
        key: 'rzp_test_TfptvIkxuI0DOj',
        amount: data.amount,
        currency: data.currency,
        name: 'MedChain',
        description: `${selected.name} × ${requestedQuantity}`,
        order_id: data.id,

        handler: async function (paymentResponse) {
          try {
            const verifyResponse = await fetch(
              'http://localhost:5000/api/medicines/payment/verify',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,
                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,
                  razorpay_signature:
                    paymentResponse.razorpay_signature,
                }),
              }
            )

            const verifyData =
              await verifyResponse.json()

            if (
              !verifyResponse.ok ||
              !verifyData.verified
            ) {
              throw new Error(
                verifyData.error ||
                'Payment verification failed'
              )
            }

            console.log(
              'Razorpay payment verified:',
              paymentResponse.razorpay_payment_id
            )

            setPaymentDone(true)
          } catch (error) {
            console.error(
              'Payment verification error:',
              error
            )

            alert(
              error.message ||
              'Payment verification failed.'
            )
          }
        },

        prefill: {
          name: 'MedChain User',
        },

        theme: {
          color: '#25c79a',
        },

        modal: {
          ondismiss: function () {
            console.log(
              'Razorpay payment window closed'
            )
          },
        },
      }

      const razorpay = new window.Razorpay(options)

      razorpay.on(
        'payment.failed',
        function (response) {
          console.error(
            'RAZORPAY PAYMENT FAILED'
          )
          console.error(
            'Code:',
            response.error.code
          )
          console.error(
            'Description:',
            response.error.description
          )
          console.error(
            'Source:',
            response.error.source
          )
          console.error(
            'Step:',
            response.error.step
          )
          console.error(
            'Reason:',
            response.error.reason
          )
          console.error(
            'Order ID:',
            response.error.metadata?.order_id
          )
          console.error(
            'Payment ID:',
            response.error.metadata?.payment_id
          )

          alert(
            `Payment Failed\n\n${response.error.description ||
            'Unknown Razorpay error'
            }`
          )
        }
      )

      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)

      alert(
        error.message ||
        'Payment could not be started.'
      )
    }
  }

  return (
    <div>
      {/* Section heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
            Medicine catalogue
          </p>

          <h2 className="mt-1 font-display text-2xl font-bold text-ink">
            Available medicine
          </h2>

          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
            Browse verified stock from your upstream
            network and place an order when needed.
          </p>
        </div>

        <Button
          variant="mint"
          onClick={() => {
            setPaymentDone(false)
            setShowOrder(!showOrder)
          }}
        >
          {showOrder ? 'Cancel order' : 'Place an order'} →
        </Button>
      </div>

      {/* Order panel */}
      {showOrder && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50/50">
          <div className="border-b border-emerald-100 bg-white/70 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink font-bold text-mint">
                +
              </span>

              <div>
                <p className="font-semibold text-ink">
                  Build an order
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Select medicine, quantity, and complete
                  payment.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_180px]">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Medicine
                </label>

                <select
                  value={selected?._id || ''}
                  onChange={(e) => {
                    setSelected(
                      medicines.find(
                        (item) =>
                          item._id ===
                          e.target.value
                      )
                    )

                    setPaymentDone(false)
                  }}
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-mint focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">
                    Select a medicine
                  </option>

                  {medicines.map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.name} ·{' '}
                      {item.quantity || 0} units
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  placeholder="Units"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value)
                    setPaymentDone(false)
                  }}
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-mint focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Selected medicine information */}
            {selected && (
              <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-ink">
                      {selected.name}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                      <span>
                        Batch {selected.batchNumber}
                      </span>

                      <span>
                        Available{' '}
                        {selected.quantity || 0}{' '}
                        units
                      </span>
                    </div>
                  </div>

                  <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    In stock
                  </span>
                </div>
              </div>
            )}

            {/* Order summary */}
            {selected && quantity && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-ink">
                    Order summary
                  </p>

                  <span className="text-xs font-semibold text-slate-400">
                    {quantity} unit
                    {Number(quantity) === 1
                      ? ''
                      : 's'}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Medicine
                    </span>

                    <span className="text-right font-semibold text-ink">
                      {selected.name}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Quantity
                    </span>

                    <span className="font-semibold text-ink">
                      {quantity} units
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Price per unit
                    </span>

                    <span className="font-semibold text-ink">
                      ₹{selected.price || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="font-bold text-ink">
                      Total amount
                    </span>

                    <span className="font-display text-xl font-bold text-emerald-600">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  {!paymentDone ? (
                    <Button
                      onClick={handlePayment}
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      {loading
                        ? 'Starting payment...'
                        : `Pay ₹${totalAmount.toFixed(2)}`}
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-600 text-white">
                          ✓
                        </span>

                        <div>
                          <p>
                            Payment successful
                          </p>
                          <p className="mt-0.5 text-xs font-normal text-emerald-600">
                            Payment verified successfully.
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={placeOrder}
                        disabled={loading}
                        className="w-full sm:w-auto"
                      >
                        {loading
                          ? 'Processing...'
                          : 'Confirm order →'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Medicine cards */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
            Stock catalogue
          </p>

          <p className="text-xs text-slate-400">
            {medicines.length} medicine
            {medicines.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {medicines.length ? (
            medicines.map((item) => (
              <button
                onClick={() => {
                  setSelected(item)
                  setQuantity('')
                  setPaymentDone(false)
                  setShowOrder(true)
                }}
                key={item._id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_10px_28px_rgba(15,23,42,.07)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 font-display text-lg font-bold text-emerald-700">
                    {item.name?.[0]?.toUpperCase() ||
                      'M'}
                  </span>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                    In stock
                  </span>
                </div>

                <div className="mt-5">
                  <h3 className="font-display text-lg font-bold text-ink">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Batch {item.batchNumber}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Available
                    </p>

                    <p className="mt-1 text-sm font-semibold text-ink">
                      {item.quantity || 0} units
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Unit price
                    </p>

                    <p className="mt-1 text-sm font-bold text-ink">
                      ₹{item.price || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-medium text-slate-400">
                    Click to order
                  </span>

                  <span className="text-sm font-bold text-emerald-600 transition group-hover:translate-x-0.5">
                    View →
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="md:col-span-2">
              <Empty text="No medicine available yet." />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
/* =========================================================
   VERIFY MEDICINE
   ========================================================= */

function Verify({ id }) {
  const [show, setShow] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [medicines, setMedicines] = useState([])
  const [selectedMedicineId, setSelectedMedicineId] = useState('')
  const [medicineLoading, setMedicineLoading] = useState(false)

  /*
   * Verify a medicine using its medicineId.
   * Used by both the real QR scanner
   * and the Test verification button.
   */
  const handleScan = async (qrData) => {
    setLoading(true)
    setError('')
    setData(null)

    try {
      const medicineId = qrData?.medicineId

      if (!medicineId) {
        throw new Error(
          'Invalid MedChain QR code. Medicine ID not found.'
        )
      }

      const response = await fetch(
        `${API_URL}/medicines/verify/${encodeURIComponent(
          medicineId
        )}`
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.error || 'Medicine verification failed.'
        )
      }

      setData(result)

      /*
       * Refresh history after every successful verification
       * so the newest scan appears immediately.
       */
      await loadHistory()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /*
   * Load verification history from MongoDB.
   */
  const loadHistory = async () => {
    setHistoryLoading(true)

    try {
      const response = await fetch(
        `${API_URL}/medicines/verification-history`
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.error || 'Failed to load scan history.'
        )
      }

      setHistory(result)
    } catch (err) {
      console.error(
        'Failed to load scan history:',
        err
      )
    } finally {
      setHistoryLoading(false)
    }
  }

  /*
   * Load all registered medicines for Test verification.
   */
  const loadMedicines = async () => {
    setMedicineLoading(true)

    try {
      const response = await fetch(
        `${API_URL}/medicines`
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.error || 'Failed to load medicines.'
        )
      }

      setMedicines(result)

      if (result.length > 0) {
        setSelectedMedicineId(result[0].medicineId)
      }
    } catch (err) {
      console.error(
        'Failed to load medicines:',
        err
      )
    } finally {
      setMedicineLoading(false)
    }
  }

  /*
   * Load existing history when Verify opens.
   */
  useEffect(() => {
    loadHistory()
    loadMedicines()
  }, [])

  const getResultStyle = (result) => {
    if (result === 'AUTHENTIC') {
      return {
        wrapper:
          'border-emerald-200 bg-emerald-50',
        icon:
          'bg-emerald-600 text-white',
        title:
          'text-emerald-700',
      }
    }

    if (result === 'SUSPICIOUS') {
      return {
        wrapper:
          'border-amber-200 bg-amber-50',
        icon:
          'bg-amber-500 text-white',
        title:
          'text-amber-700',
      }
    }

    return {
      wrapper:
        'border-rose-200 bg-rose-50',
      icon:
        'bg-rose-600 text-white',
      title:
        'text-rose-700',
    }
  }

  const getHistoryBadge = (result) => {
    if (result === 'AUTHENTIC') {
      return 'border-emerald-100 bg-emerald-50 text-emerald-700'
    }

    if (result === 'SUSPICIOUS') {
      return 'border-amber-100 bg-amber-50 text-amber-700'
    }

    return 'border-rose-100 bg-rose-50 text-rose-700'
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
          Trust & verification
        </p>

        <h2 className="mt-1 font-display text-2xl font-bold text-ink">
          Verify medicine authenticity
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Scan a MedChain QR identity or run a test
          verification to check the medicine against
          MongoDB and the blockchain.
        </p>
      </div>

      {/* Verification controls */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.04)]">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink font-bold text-mint">
            ✓
          </span>

          <div>
            <p className="font-semibold text-ink">
              Verification tools
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              Use a real QR scan or test a registered medicine.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Test verification
          </label>

          <select
            value={selectedMedicineId}
            onChange={(e) =>
              setSelectedMedicineId(e.target.value)
            }
            disabled={medicineLoading}
            className="mt-2 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-mint focus:ring-2 focus:ring-emerald-100"
          >
            {medicineLoading ? (
              <option value="">
                Loading medicines...
              </option>
            ) : (
              <>
                <option value="">
                  Select a medicine
                </option>

                {medicines.map((medicine) => (
                  <option
                    key={medicine.medicineId}
                    value={medicine.medicineId}
                  >
                    {medicine.name} —{' '}
                    {medicine.batchNumber}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            variant="mint"
            onClick={() => {
              setShow(!show)
              setError('')
            }}
          >
            {show
              ? 'Close scanner'
              : 'Open scanner'}{' '}
            →
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              if (!selectedMedicineId) {
                setError(
                  'Please select a medicine first.'
                )
                return
              }

              handleScan({
                medicineId: selectedMedicineId,
              })
            }}
            disabled={
              medicineLoading ||
              !selectedMedicineId
            }
          >
            Test verification
          </Button>
        </div>
      </div>

      {/* Real QR scanner */}
      {show && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_20px_rgba(15,23,42,.04)]">
          <div className="mb-4">
            <p className="font-semibold text-ink">
              Scan medicine QR
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Position the medicine QR code inside the
              scanner frame.
            </p>
          </div>

          <div className="max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3">
            <Scanner
              id={id}
              onScan={handleScan}
            />
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sm text-sky-700">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-sky-100 font-bold">
            ...
          </span>

          <div>
            <p className="font-semibold">
              Verifying medicine
            </p>

            <p className="mt-0.5 text-xs text-sky-600">
              Checking registration, blockchain data,
              expiry, and status.
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-rose-100 font-bold">
            !
          </span>

          <div>
            <p className="font-semibold">
              Verification issue
            </p>

            <p className="mt-1 text-xs leading-5 text-rose-600">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Verification result */}
      {data && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,.05)]">
          {(() => {
            const resultStyle =
              getResultStyle(data.result)

            return (
              <div
                className={`border-b p-5 ${resultStyle.wrapper}`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-2xl text-xl font-bold ${resultStyle.icon}`}
                  >
                    {data.result === 'AUTHENTIC'
                      ? '✓'
                      : data.result === 'SUSPICIOUS'
                        ? '!'
                        : '✕'}
                  </span>

                  <div>
                    <p
                      className={`text-lg font-bold ${resultStyle.title}`}
                    >
                      {data.result === 'AUTHENTIC'
                        ? 'AUTHENTIC MEDICINE'
                        : data.result ===
                          'SUSPICIOUS'
                          ? 'SUSPICIOUS MEDICINE'
                          : 'VERIFICATION FAILED'}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {data.result ===
                        'AUTHENTIC'
                        ? 'This medicine is registered and verified against the MedChain blockchain.'
                        : data.result ===
                          'SUSPICIOUS'
                          ? 'The medicine requires further investigation.'
                          : 'This medicine identity could not be verified on the MedChain blockchain.'}
                    </p>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Medicine information */}
          {data.medicine && (
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
                    Medicine details
                  </p>

                  <h3 className="mt-1 font-display text-lg font-bold text-ink">
                    {data.medicine.name}
                  </h3>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-[11px] font-semibold text-slate-500">
                  {data.medicine.medicineId}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Batch
                  </p>

                  <p className="mt-1 text-sm font-semibold text-ink">
                    {data.medicine.batchNumber}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Manufacturer
                  </p>

                  <p className="mt-1 text-sm font-semibold text-ink">
                    {data.medicine.manufacturer}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-ink">
                    {data.medicine.status}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Expiry
                  </p>

                  <p className="mt-1 text-sm font-semibold text-ink">
                    {new Date(
                      data.medicine.expiryDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Verification checks */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <div>
                  <p className="font-semibold text-ink">
                    Verification checks
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Each condition is checked before the
                    final result is returned.
                  </p>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {[
                    [
                      'Blockchain registered',
                      data.checks.registered,
                    ],
                    [
                      'Blockchain match',
                      data.checks.blockchainMatch,
                    ],
                    [
                      'Not expired',
                      data.checks.notExpired,
                    ],
                    [
                      'Valid status',
                      data.checks.validStatus,
                    ],
                  ].map(
                    ([label, passed]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                      >
                        <span className="text-sm text-slate-600">
                          {label}
                        </span>

                        <span
                          className={`flex items-center gap-1.5 text-xs font-bold ${passed
                            ? 'text-emerald-600'
                            : 'text-rose-600'
                            }`}
                        >
                          <span
                            className={`grid h-6 w-6 place-items-center rounded-full ${passed
                              ? 'bg-emerald-100'
                              : 'bg-rose-100'
                              }`}
                          >
                            {passed ? '✓' : '✕'}
                          </span>

                          {passed
                            ? 'Passed'
                            : 'Failed'}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                className="mt-5"
                onClick={() => setData(null)}
              >
                Clear result
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Scan history */}
      <div className="mt-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">
              Verification activity
            </p>

            <h3 className="mt-1 font-display text-xl font-bold text-ink">
              Scan history
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Recent medicine verification scans.
            </p>
          </div>

          <Button
            variant="ghost"
            onClick={loadHistory}
            disabled={historyLoading}
          >
            {historyLoading
              ? 'Refreshing...'
              : '↻ Refresh'}
          </Button>
        </div>

        {historyLoading &&
          history.length === 0 && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
              Loading scan history...
            </div>
          )}

        {!historyLoading &&
          history.length === 0 && (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-white font-bold text-slate-400 shadow-sm">
                ✓
              </span>

              <p className="mt-3 text-sm font-semibold text-slate-600">
                No verification scans yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Verified medicines will appear here.
              </p>
            </div>
          )}

        {history.length > 0 && (
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {history.map((scan) => (
              <div
                key={scan._id}
                className="border-b border-slate-100 p-5 last:border-0"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 font-bold text-slate-500">
                      {scan.medicineName?.[0]?.toUpperCase() ||
                        'M'}
                    </span>

                    <div>
                      <p className="font-semibold text-ink">
                        {scan.medicineName ||
                          'Unknown medicine'}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Batch:{' '}
                        {scan.batchNumber ||
                          'Unknown'}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Manufacturer:{' '}
                        {scan.manufacturer ||
                          'Unknown'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${getHistoryBadge(
                      scan.result
                    )}`}
                  >
                    {scan.result}
                  </span>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
                  Verified{' '}
                  {new Date(
                    scan.verifiedAt
                  ).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


/* =========================================================
   CONSUMER
   ========================================================= */

function Consumer() {
  const [medicines, setMedicines] = useState([])
  const [term, setTerm] = useState('')
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('search')

  useEffect(() => {
    fetch(`${API_URL}/medicines`)
      .then((res) => res.json())
      .then(setMedicines)
      .catch(() => { })
  }, [])

  const filtered = useMemo(
    () =>
      medicines.filter((item) =>
        `${item.name} ${item.batchNumber}`
          .toLowerCase()
          .includes(term.toLowerCase())
      ),
    [medicines, term]
  )

  return (
    <>
      <Heading
        eyebrow="Patient trust center"
        title="Know what you’re taking"
        description="Search the live medicine network or scan a batch identity before it reaches your cabinet."
      />

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,.04)]">
        <div className="flex gap-1 border-b border-slate-100 p-2">
          <button
            onClick={() => setTab('search')}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${tab === 'search'
              ? 'bg-ink text-white'
              : 'text-slate-500'
              }`}
          >
            Search network
          </button>

          <button
            onClick={() => setTab('verify')}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${tab === 'verify'
              ? 'bg-ink text-white'
              : 'text-slate-500'
              }`}
          >
            Verify with QR
          </button>
        </div>

        <div className="p-5 md:p-7">
          {tab === 'search' ? (
            <>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-400">
                  ⌕
                </span>

                <input
                  value={term}
                  onChange={(e) =>
                    setTerm(e.target.value)
                  }
                  placeholder="Search medicine name or batch number..."
                  className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-mint focus:bg-white"
                />
              </div>

              <div className="mt-6 overflow-hidden rounded-xl border border-slate-100">
                <div className="hidden grid-cols-[1fr_1fr_.8fr_.6fr] bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 md:grid">
                  <span>Medicine</span>
                  <span>Manufacturer</span>
                  <span>Stock</span>
                  <span>Status</span>
                </div>

                {filtered.length ? (
                  filtered.map((item) => (
                    <MedicineRow
                      key={item._id}
                      medicine={item}
                      onClick={() =>
                        setSelected(item)
                      }
                    />
                  ))
                ) : (
                  <Empty text="No medicines match that search." />
                )}
              </div>
            </>
          ) : (
            <Verify id="consumer-scanner" />
          )}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-20 grid place-items-center bg-ink/60 p-5 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl bg-white p-7 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-600">
                  Verified record
                </p>

                <h2 className="mt-2 font-display text-3xl font-bold">
                  {selected.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Batch {selected.batchNumber}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500"
              >
                ×
              </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {selected.qrCodeData && (
                <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-center">
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Medicine QR Code
                  </p>
                  <QRCodeSVG
                    value={selected.qrCodeData}
                    size={200}
                    className="mx-auto h-auto max-w-full"
                  />
                </div>
              )}
              {[
                ['Manufacturer', selected.manufacturer],
                ['Blockchain ID', selected.blockchainId],
                ['Components', selected.chemicalComponents],
                ['Dosage', selected.dosage || 'Not specified'],
                [
                  'Manufactured',
                  selected.manufacturingDate &&
                  new Date(
                    selected.manufacturingDate
                  ).toLocaleDateString(),
                ],
                [
                  'Expires',
                  selected.expiryDate &&
                  new Date(
                    selected.expiryDate
                  ).toLocaleDateString(),
                ],
                [
                  'Storage',
                  selected.storageConditions ||
                  'Not specified',
                ],
                [
                  'Quantity',
                  `${selected.quantity || 0} units`,
                ],
              ].map(([label, value]) => (
                <div
                  className="rounded-xl bg-slate-50 p-4"
                  key={label}
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {label}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-ink">
                    {value || '—'}
                  </p>
                </div>
              ))}
            </div>

            <Button
              className="mt-7 w-full"
              onClick={() => setSelected(null)}
            >
              Close record
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

/* =========================================================
   STATS
   ========================================================= */

function Stat({
  label,
  value,
  hint,
  tone = 'mint',
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,.04)]">
      <div className="mb-5 flex items-center justify-between">
        <span
          className={`h-2.5 w-2.5 rounded-full ${tone === 'mint'
            ? 'bg-mint'
            : tone === 'amber'
              ? 'bg-amber-400'
              : 'bg-cyan'
            }`}
        />

        <span className="text-xs font-semibold uppercase tracking-[.16em] text-slate-400">
          {hint}
        </span>
      </div>

      <p className="font-display text-3xl font-bold text-ink">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>
    </div>
  )
}

/* =========================================================
   ADMIN PANEL
   ========================================================= */

function AdminPanel() {
  const [medicines, setMedicines] = useState([])

  const [users, setUsers] = useState(() =>
    JSON.parse(
      localStorage.getItem('medchain-users') || '[]'
    )
  )

  const [tab, setTab] = useState('orders')
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [passwordDrafts, setPasswordDrafts] = useState({})

  const loadMedicines = async () => {
    const response = await fetch(
      `${API_URL}/medicines`
    )

    if (!response.ok) {
      throw new Error('Could not load medicines')
    }

    setMedicines(await response.json())
  }

  useEffect(() => {
    loadMedicines().catch(() =>
      setNotice(
        'Backend is unavailable. Start the API on port 5000.'
      )
    )
  }, [])

  const updateMedicine = async (
    medicine,
    updates
  ) => {
    setSaving(true)

    try {
      const response = await fetch(
        `${API_URL}/medicines/${medicine._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.error || 'Update failed'
        )
      }

      setMedicines((items) =>
        items.map((item) =>
          item._id === medicine._id
            ? data.medicine
            : item
        )
      )

      setSelected(data.medicine)

      setNotice(
        'Medicine updated and blockchain status synchronized.'
      )
    } catch (error) {
      setNotice(error.message)
    } finally {
      setSaving(false)
    }
  }

  const acceptOrder = (medicine) =>
    updateMedicine(medicine, {
      status: 'Stored',
    })

  const pendingOrders = medicines.filter(
    (medicine) =>
      medicine.status === 'InTransit' &&
      medicine.orderedQuantity
  )

  const saveRole = (email, role) => {
    const next = users.map((user) =>
      user.email === email
        ? { ...user, role }
        : user
    )

    setUsers(next)

    localStorage.setItem(
      'medchain-users',
      JSON.stringify(next)
    )
  }

  const resetPassword = (email) => {
    const password = passwordDrafts[email] || ''

    if (password.length < 6) {
      return setNotice(
        'Use at least 6 characters for a password.'
      )
    }

    const next = users.map((user) =>
      user.email === email
        ? { ...user, password }
        : user
    )

    setUsers(next)

    localStorage.setItem(
      'medchain-users',
      JSON.stringify(next)
    )

    setPasswordDrafts({
      ...passwordDrafts,
      [email]: '',
    })

    setNotice('Password reset successfully.')
  }

  return (
    <>
      <Heading
        eyebrow="Restricted workspace"
        title="Super Admin control"
        description="Monitor users, accept supply-chain orders, and maintain medicine records from one operational console."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Stat
          label="Registered medicines"
          value={medicines.length}
          hint="Network"
        />

        <Stat
          label="Orders awaiting acceptance"
          value={pendingOrders.length}
          hint="Action needed"
          tone="amber"
        />

        <Stat
          label="Known local accounts"
          value={users.length}
          hint="Directory"
          tone="cyan"
        />
      </div>

      {notice && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {notice}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,.04)]">
        <div className="flex gap-1 overflow-x-auto border-b border-slate-100 p-2">
          <button
            onClick={() => setTab('orders')}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${tab === 'orders'
              ? 'bg-ink text-white'
              : 'text-slate-500'
              }`}
          >
            Order approvals
          </button>

          <button
            onClick={() => setTab('medicines')}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${tab === 'medicines'
              ? 'bg-ink text-white'
              : 'text-slate-500'
              }`}
          >
            Medicine records
          </button>

          <button
            onClick={() => setTab('users')}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold ${tab === 'users'
              ? 'bg-ink text-white'
              : 'text-slate-500'
              }`}
          >
            User directory
          </button>
        </div>

        <div className="p-5 md:p-7">
          {tab === 'orders' && (
            <div>
              <h2 className="font-display text-xl font-bold">
                Accept incoming orders
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Acceptance changes the record to Stored and
                writes the status update to Ethereum.
              </p>

              {pendingOrders.length ? (
                <div className="mt-5 divide-y divide-slate-100">
                  {pendingOrders.map((medicine) => (
                    <div
                      key={medicine._id}
                      className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-ink">
                          {medicine.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Batch {medicine.batchNumber} ·{' '}
                          {medicine.orderedQuantity} units ·{' '}
                          {medicine.distributor ||
                            medicine.retailer}
                        </p>
                      </div>

                      <Button
                        variant="mint"
                        onClick={() =>
                          acceptOrder(medicine)
                        }
                        disabled={saving}
                      >
                        Accept order →
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty text="No orders are waiting for acceptance." />
              )}
            </div>
          )}

          {tab === 'medicines' && (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-bold">
                    All medicine records
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Select a record to update its operational
                    details.
                  </p>
                </div>

                <Button
                  variant="ghost"
                  onClick={() =>
                    loadMedicines().catch(() =>
                      setNotice(
                        'Could not refresh records.'
                      )
                    )
                  }
                >
                  Refresh
                </Button>
              </div>

              <div className="mt-5 overflow-hidden rounded-xl border border-slate-100">
                {medicines.length ? (
                  medicines.map((medicine) => (
                    <MedicineRow
                      key={medicine._id}
                      medicine={medicine}
                      onClick={() =>
                        setSelected(medicine)
                      }
                    />
                  ))
                ) : (
                  <Empty text="No medicine records found." />
                )}
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div>
              <h2 className="font-display text-xl font-bold">
                User directory
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Passwords are intentionally hidden. Reset
                credentials through a secure auth flow instead
                of exposing them.
              </p>

              <div className="mt-5 overflow-hidden rounded-xl border border-slate-100">
                {users.length ? (
                  users.map((user) => (
                    <div
                      className="grid gap-3 border-b border-slate-100 px-5 py-4 md:grid-cols-[1fr_180px_150px] md:items-center"
                      key={user.email}
                    >
                      <div>
                        <p className="font-semibold">
                          {user.email}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Login ID · {user.email}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="password"
                          value={
                            passwordDrafts[user.email] || ''
                          }
                          onChange={(event) =>
                            setPasswordDrafts({
                              ...passwordDrafts,
                              [user.email]:
                                event.target.value,
                            })
                          }
                          placeholder="New password"
                          className="w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        />

                        <button
                          onClick={() =>
                            resetPassword(user.email)
                          }
                          className="rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white"
                        >
                          Reset
                        </button>
                      </div>

                      <select
                        value={user.role}
                        onChange={(event) =>
                          saveRole(
                            user.email,
                            event.target.value
                          )
                        }
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      >
                        {roles.map((role) => (
                          <option key={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))
                ) : (
                  <Empty text="No registered accounts yet." />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-20 grid place-items-center bg-ink/60 p-5 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-emerald-600">
                  Admin edit
                </p>

                <h2 className="mt-2 font-display text-2xl font-bold">
                  {selected.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Batch {selected.batchNumber}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field
                label="Medicine name"
                value={selected.name}
                onChange={(event) =>
                  setSelected({
                    ...selected,
                    name: event.target.value,
                  })
                }
              />

              <Field
                label="Quantity"
                type="number"
                value={selected.quantity || 0}
                onChange={(event) =>
                  setSelected({
                    ...selected,
                    quantity: Number(
                      event.target.value
                    ),
                  })
                }
              />

              <Field
                label="Price"
                type="number"
                value={selected.price || 0}
                onChange={(event) =>
                  setSelected({
                    ...selected,
                    price: Number(
                      event.target.value
                    ),
                  })
                }
              />

              <label className="grid gap-2 text-sm font-semibold text-slate-600">
                Status

                <select
                  value={selected.status}
                  onChange={(event) =>
                    setSelected({
                      ...selected,
                      status: event.target.value,
                    })
                  }
                  className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal"
                >
                  {[
                    'Manufactured',
                    'InTransit',
                    'Stored',
                    'Sold',
                    'Expired',
                    'Recalled',
                  ].map((status) => (
                    <option key={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <Button
              className="mt-7 w-full"
              onClick={() =>
                updateMedicine(selected, {
                  name: selected.name,
                  quantity: selected.quantity,
                  price: selected.price,
                  status: selected.status,
                })
              }
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : 'Save record and sync blockchain'}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
/* =========================================================
   MAIN APP
   ========================================================= */

function App() {
  const [user, setUser] = useState(null)
  const [auth, setAuth] = useState(null)

  // Light / Dark theme
  const [theme, setTheme] = useState(
    () => localStorage.getItem('medchain-theme') || 'dark'
  )

  // Apply theme globally to the whole application
  useEffect(() => {
    document.documentElement.classList.remove(
      'theme-light',
      'theme-dark'
    )

    document.documentElement.classList.add(
      theme === 'dark' ? 'theme-dark' : 'theme-light'
    )

    localStorage.setItem('medchain-theme', theme)
  }, [theme])

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme((current) =>
      current === 'light' ? 'dark' : 'light'
    )
  }

  /* =======================================================
     AUTH / LANDING
     ======================================================= */

  if (!user) {
    // Login / Signup screen
    if (auth) {
      return (
        <Auth
          {...auth}
          theme={theme}
          onBack={() => setAuth(null)}
          onLogin={setUser}
          onSignup={(email, password, role) =>
            setUser({
              email,
              password,
              role,
            })
          }
        />
      )
    }

    // Landing page
    return (
      <Landing
        onRole={(role) =>
          setAuth({
            mode: 'login',
            role,
          })
        }
        onSignup={() =>
          setAuth({
            mode: 'signup',
          })
        }
        onAdmin={() =>
          setAuth({
            mode: 'login',
            role: adminRole,
          })
        }
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  /* =======================================================
     ROLE-BASED CONTENT
     ======================================================= */

  const content =
    user.role === adminRole ? (
      <AdminPanel />
    ) : user.role === 'Manufacturer' ? (
      <Manufacturer user={user} />
    ) : user.role === 'Consumer' ? (
      <Consumer />
    ) : (
      <SupplyDashboard
        user={user}
        retailer={user.role === 'Retailer'}
      />
    )

  /* =======================================================
     LOGGED-IN APPLICATION
     ======================================================= */

  return (
    <Layout
      user={user}
      onLogout={() => setUser(null)}
    >
      {content}

      <p className="mt-10 text-center text-xs text-slate-400">
        MedChain network · Connected to local API at{' '}
        {API_URL}
      </p>
    </Layout>
  )
}
export default App