import Link from "next/link";

const PUMP_SKETCH = `#include <Wire.h>
#include <RTClib.h>

// Pin Definitions
const int PUMP_PIN = 14; // Connected to MOSFET Gate

RTC_DS3231 rtc;

void setup() {
  Serial.begin(115200);
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, LOW);

  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC");
    while (1);
  }
}

void loop() {
  DateTime now = rtc.now();

  // Peak windows (Dawn: 6AM, Dusk: 6PM) — adjust for your latitude/season
  bool isMorningPeak = (now.hour() == 6);
  bool isEveningPeak = (now.hour() == 18);

  if (isMorningPeak || isEveningPeak) {
    Serial.println("Dispensing scent during peak window...");

    digitalWrite(PUMP_PIN, HIGH);
    delay(3000); // pump 3 seconds
    digitalWrite(PUMP_PIN, LOW);

    // Sleep ~55 min to avoid re-trigger in same hour
    delay(3300000);
  } else {
    delay(600000); // check every 10 min off-peak
  }
}`;

export default function FieldGuidePage() {
  return (
    <div className="min-h-screen bg-deep text-cream-100">
      <nav className="sticky top-0 z-20 border-b border-white/[0.04] glass-strong">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="font-serif text-lg">
            BuckTracks
          </Link>
          <div className="flex gap-4 text-sm text-cream-300/55">
            <Link href="/master-baiter" className="hover:text-amber-300">
              Master Baiter
            </Link>
            <Link href="/land-3d" className="hover:text-amber-300">
              Land 3D
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-10 pb-24">
        <p className="text-[11px] uppercase tracking-[0.2em] text-amber-400/70 mb-2">
          Field reference · free
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-cream-50 tracking-tight mb-3">
          Advanced Whitetail Scouting &
          <br />
          <span className="text-gradient-amber">Automated Scent Dispenser</span>
        </h1>
        <p className="text-cream-300/55 text-sm leading-relaxed mb-8 max-w-2xl">
          Technical and strategic notes for patterning mature bucks — digital mapping, timber cuts,
          camera tradecraft, and a low-power timed attractant dispenser. Fair chase applies. Confirm
          all baiting and scent rules with Nova Scotia DNR before you deploy anything in the field.
        </p>

        {/* 1 */}
        <section className="card-premium p-6 sm:p-8 mb-5">
          <h2 className="font-serif text-xl text-cream-50 mb-3 border-b border-amber-500/20 pb-2">
            1. Digital mapping & scouting platforms
          </h2>
          <p className="text-sm text-cream-300/55 mb-4">
            E-scouting mature whitetails — platforms that excel in different jobs:
          </p>
          <ul className="space-y-3 text-sm text-cream-200/80 leading-relaxed">
            <li>
              <strong className="text-amber-300/90">onX Hunt</strong> — Best overall mapping &
              offline reliability: high-res aerial/topo, property boundaries, deep-woods offline
              cache.
            </li>
            <li>
              <strong className="text-amber-300/90">HuntStand</strong> — Best value & organization:
              parcels, tabs for stands, cameras, harvest logs.
            </li>
            <li>
              <strong className="text-amber-300/90">Spartan Forge</strong> — Predictive movement &
              AI: collar-informed models, LiDAR, pressure-aware movement.
            </li>
            <li>
              <strong className="text-amber-300/90">HuntWise</strong> — Forecasting & wind:
              HuntCast / WindCast scoring from pressure and wind.
            </li>
            <li>
              <strong className="text-moss-400">BuckTracks (here)</strong> — Free NS-focused kit:
              Land 200 m 3D, live weather, trail cam AI, SOS, Master Baiter — no paywall.
            </li>
          </ul>
        </section>

        {/* 2 */}
        <section className="card-premium p-6 sm:p-8 mb-5">
          <h2 className="font-serif text-xl text-cream-50 mb-3 border-b border-amber-500/20 pb-2">
            2. Timber cuts, crops & historical layers
          </h2>
          <p className="text-sm text-cream-300/55 mb-4">
            Mature bucks exploit early succession, mast, and isolated ag:
          </p>
          <ul className="space-y-3 text-sm text-cream-200/80 leading-relaxed">
            <li>
              <strong className="text-cream-50">1–3 year cuts</strong> — Browse, briars, forbs;
              high-protein early-fall feed.
            </li>
            <li>
              <strong className="text-cream-50">5–10 year cuts</strong> — 6–10 ft saplings/conifers;
              bedding thickets with low visibility.
            </li>
            <li>
              <strong className="text-cream-50">Micro-ag pockets</strong> — Small leases, old
              clearings, 1-acre plots inside timber pull bucks earlier than big open fields.
            </li>
            <li>
              <strong className="text-cream-50">Fire & storm scars</strong> — Act like cuts:
              concentrated browse away from pressure.
            </li>
          </ul>
          <p className="mt-4 text-xs text-cream-300/40">
            Use Land 3D + satellite/topo layers to mark these before you walk them.
          </p>
        </section>

        {/* 3 */}
        <section className="card-premium p-6 sm:p-8 mb-5">
          <h2 className="font-serif text-xl text-cream-50 mb-3 border-b border-amber-500/20 pb-2">
            3. Trail cameras & natural attractants
          </h2>
          <ul className="space-y-3 text-sm text-cream-200/80 leading-relaxed">
            <li>
              <strong className="text-cream-50">High-angle cams</strong> — 7–8 ft up, angled down
              30–45° so lenses sit out of a mature buck’s eye line.
            </li>
            <li>
              <strong className="text-cream-50">Mock scrapes</strong> — Cleared earth under a licking
              branch on transition trails; log antlers without constant intrusion.
            </li>
            <li>
              <strong className="text-cream-50">Aromatic blends</strong> — Long-range olfactories
              (e.g. fermented grain + sweet carriers on porous wood). See Master Baiter for recipes
              and NS legality notes.
            </li>
            <li>
              <strong className="text-cream-50">Cellular cams</strong> — Cut weekly SD walks and
              human scent loops into core cover.
            </li>
          </ul>
          <Link
            href="/cams"
            className="inline-block mt-4 text-sm text-amber-300 hover:text-amber-200"
          >
            Open trail cam AI →
          </Link>
        </section>

        {/* 4 */}
        <section className="card-premium p-6 sm:p-8 mb-5">
          <h2 className="font-serif text-xl text-cream-50 mb-3 border-b border-amber-500/20 pb-2">
            4. Automated scent dispenser — parts
          </h2>
          <p className="text-sm text-cream-300/55 mb-4">
            Rugged, low-power unit that doses attractant on a timer so you stay out of core timber:
          </p>
          <ul className="space-y-2 text-sm text-cream-200/80">
            <li>
              <strong className="text-cream-50">MCU:</strong> ESP32 or Arduino Pro Mini (3.3 V)
            </li>
            <li>
              <strong className="text-cream-50">Pump:</strong> 3–6 V mini peristaltic
            </li>
            <li>
              <strong className="text-cream-50">Power:</strong> 18650 pack + 5–10 W solar trickle
            </li>
            <li>
              <strong className="text-cream-50">Switch:</strong> Logic-level N-MOSFET (e.g. IRLZ44N)
              or mini relay
            </li>
            <li>
              <strong className="text-cream-50">Clock:</strong> DS3231 RTC
            </li>
            <li>
              <strong className="text-cream-50">Box:</strong> IP67 UV-resistant enclosure
            </li>
          </ul>
          <p className="mt-4 text-xs text-amber-300/70 leading-relaxed">
            Legal note: automated attractant devices may be restricted by province or season. This
            is a technical reference only — not permission to run bait or scent where prohibited.
          </p>
        </section>

        {/* 5 */}
        <section className="card-premium p-6 sm:p-8 mb-5">
          <h2 className="font-serif text-xl text-cream-50 mb-3 border-b border-amber-500/20 pb-2">
            5. Sample ESP32 control sketch
          </h2>
          <p className="text-sm text-cream-300/55 mb-4">
            Wake on peak hours, run peristaltic via MOSFET, idle between windows. Tune hours for
            your latitude and season; prefer light-sleep APIs on ESP32 for longer battery life in a
            production build.
          </p>
          <pre className="rounded-xl bg-black/60 border border-white/10 p-4 overflow-x-auto text-[11px] sm:text-xs leading-relaxed text-moss-400/90 font-mono whitespace-pre">
            {PUMP_SKETCH}
          </pre>
        </section>

        <div className="flex flex-wrap gap-3 mt-8">
          <Link href="/master-baiter" className="btn-primary text-sm">
            Master Baiter recipes
          </Link>
          <Link href="/land-3d" className="btn-ghost text-sm">
            Scout in Land 3D
          </Link>
          <Link href="/weather" className="btn-ghost text-sm">
            Live weather
          </Link>
        </div>

        <p className="mt-10 text-center text-[10px] text-cream-300/25">
          Field reference · Fair chase · Confirm NS regulations before any scent or bait deployment
        </p>
      </main>
    </div>
  );
}
