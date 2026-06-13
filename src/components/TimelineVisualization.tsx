import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { 
  Calendar, 
  Sparkles, 
  Clock, 
  Gift, 
  Milestone, 
  Info, 
  ChevronLeft, 
  ChevronRight,
  User
} from "lucide-react";
import { AgeCalculationResult, SavedEvent } from "../types";
import { parseLocalMidnightDate, formatDateString } from "../utils/dateCalculators";

interface TimelineVisualizationProps {
  birthDate: string;
  targetDate: string;
  results: AgeCalculationResult;
  savedEvents: SavedEvent[];
}

interface MilestonePoint {
  id: string;
  label: string;
  date: Date;
  age: number;
  type: "milestone" | "current" | "future" | "contact";
  description: string;
  iconName: string;
}

export default function TimelineVisualization({ 
  birthDate, 
  targetDate, 
  results, 
  savedEvents 
}: TimelineVisualizationProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // State for view scope: 'life' (full journey) or 'proximity' (2-year focus)
  const [viewScope, setViewScope] = useState<"life" | "proximity">("proximity");
  const [selectedPoint, setSelectedPoint] = useState<MilestonePoint | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 180 });

  // Handle responsiveness via ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        let { width } = entry.contentRect;
        // Keep within reasonable width constraints
        const finalWidth = Math.max(width, 300);
        setDimensions({
          width: finalWidth,
          height: 180
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Compute milestones
  const points: MilestonePoint[] = (() => {
    const dob = parseLocalMidnightDate(birthDate);
    const target = parseLocalMidnightDate(targetDate);
    
    const list: MilestonePoint[] = [];

    // Base life milestones
    const baseMilestones = [
      { age: 0, label: "Your Launch 🚀", desc: "First breath of your chronological timeline. Born on a " + results.weekdayBorn },
      { age: 1, label: "First Steps 👣", desc: "Infant motor skills, exploration, and linguistic orientation" },
      { age: 5, label: "School Admission 🎒", desc: "Primary education and early social interactions" },
      { age: 10, label: "Double Digits 🔢", desc: "A decade of biological development completed" },
      { age: 13, label: "Teenager Era 🎸", desc: "Onset of secondary cognitive and adolescent phases" },
      { age: 16, label: "Drive License 🚗", desc: "Expanded legal independence and local navigation privileges" },
      { age: 18, label: "Adulthood ⚖️", desc: "Attainment of full civil rights and franchise status" },
      { age: 21, label: "Full Autonomy 🔑", desc: "Attainment of key professional and developmental parameters" },
      { age: 30, label: "Thirties Shift 📈", desc: "Professional maturation and establishment of core vectors" },
      { age: 40, label: "Quarantis Milestones 💎", desc: "Peak of professional and timeline leverage" },
      { age: 50, label: "Half Century 🏆", desc: "Golden jubilee of solar orbits completed" },
      { age: 60, label: "Diamond Wisdom 🛡️", desc: "Phased advisory transitions and retrospective clarity" },
      { age: 75, label: "Platinum Legacy 🗺️", desc: "Deep temporal legacy and legacy transfer parameters" }
    ];

    // Filter milestones that fit within their lifetime & up to age + 5 years
    const maxHorizonAge = results.years + 5;
    baseMilestones.forEach(m => {
      if (m.age <= maxHorizonAge) {
        const mDate = new Date(dob.getFullYear() + m.age, dob.getMonth(), dob.getDate());
        list.push({
          id: `base-${m.age}`,
          label: m.label,
          date: mDate,
          age: m.age,
          type: m.age === 0 ? "milestone" : "milestone",
          description: m.desc,
          iconName: "Milestone"
        });
      }
    });

    // Special status: Current Day / Measurement point
    list.push({
      id: "current-day",
      label: "Current Target Point 🎯",
      date: target,
      age: +(results.years + (results.months / 12) + (results.days / 365)).toFixed(2),
      type: "current",
      description: `Exact age measurement mark: ${results.years} Years, ${results.months} Months, and ${results.days} Days.`,
      iconName: "Clock"
    });

    // Special status: Next Birthday
    const nextBdayYear = target.getFullYear();
    let nextBdayDate = new Date(nextBdayYear, dob.getMonth(), dob.getDate());
    if (nextBdayDate <= target) {
      nextBdayDate.setFullYear(nextBdayYear + 1);
    }
    const nextAge = results.years + 1;
    list.push({
      id: "next-birthday",
      label: `Next Birthday (Age ${nextAge}) 🎂`,
      date: nextBdayDate,
      age: nextAge,
      type: "future",
      description: `Countdown: ${results.nextBirthdayDaysRemaining} days remaining for your solar transition.`,
      iconName: "Gift"
    });

    // Saved Contact Birthdays that map near our proximity scope
    // Find active birthdates from contact list that align on the target date's year
    savedEvents.forEach(ev => {
      try {
        const contactDob = parseLocalMidnightDate(ev.birthDate);
        // Map to current target year or adjacent year depending on context
        let eventDate = new Date(target.getFullYear(), contactDob.getMonth(), contactDob.getDate());
        // Calculate years since birth relative to event Date
        const contactAge = eventDate.getFullYear() - contactDob.getFullYear();
        
        list.push({
          id: `contact-${ev.id}`,
          label: `${ev.name}'s Celebration 🎈`,
          date: eventDate,
          age: contactAge,
          type: "contact",
          description: `Tracked anniversary for ${ev.name}. ${ev.notifyBeforeDays === 0 ? "Alert parameters flag exact day." : `Alert scheduled ${ev.notifyBeforeDays} days prior.`}`,
          iconName: "User"
        });
      } catch (err) {
        console.error("Anniversary mapping error for entry: ", ev, err);
      }
    });

    // Sort complete data chronologically
    return list.sort((a, b) => a.date.getTime() - b.date.getTime());
  })();

  // Trigger D3 rendering cycle on configuration changes
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear previous elements
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const padding = { left: 45, right: 45, top: 40, bottom: 45 };

    // Establish domain based on Scope choice
    let domainRange: [Date, Date];
    const target = parseLocalMidnightDate(targetDate);
    const dob = parseLocalMidnightDate(birthDate);

    if (viewScope === "proximity") {
      // Focus bounds: 12 months before to 12 months in future of target date
      const minDate = new Date(target.getFullYear(), target.getMonth() - 10, target.getDate());
      const maxDate = new Date(target.getFullYear(), target.getMonth() + 10, target.getDate());
      domainRange = [minDate, maxDate];
    } else {
      // Full life scope: Born Date to Next Birthday + 1 month
      const maxDate = new Date(target.getFullYear() + 2, dob.getMonth(), dob.getDate());
      domainRange = [dob, maxDate];
    }

    // Set interactive visual scale
    const xScale = d3.scaleTime()
      .domain(domainRange)
      .range([padding.left, width - padding.right]);

    // Draw coordinate base line
    svg.append("line")
      .attr("x1", padding.left - 10)
      .attr("y1", height - padding.bottom)
      .attr("x2", width - padding.right + 10)
      .attr("y2", height - padding.bottom)
      .attr("stroke", "currentColor")
      .attr("stroke-width", 2.5)
      .attr("class", "text-slate-200 dark:text-slate-800");

    // Filter points to match present viewport domain
    const visiblePoints = points.filter(p => 
      p.date.getTime() >= domainRange[0].getTime() && 
      p.date.getTime() <= domainRange[1].getTime()
    );

    // Render interactive tick lines & anchor nodes
    const nodeY = height - padding.bottom;
    
    // Grid reference ticks
    const timeFormatter = d3.timeFormat("%b %Y");
    const axisTicks = xScale.ticks(width > 600 ? 8 : 4);
    
    const ticksGroup = svg.append("g").attr("class", "grids");
    axisTicks.forEach(tick => {
      const tx = xScale(tick);
      
      // vertical line accent
      ticksGroup.append("line")
        .attr("x1", tx)
        .attr("y1", padding.top)
        .attr("x2", tx)
        .attr("y2", nodeY)
        .attr("stroke", "currentColor")
        .attr("stroke-dasharray", "4 4")
        .attr("stroke-width", 1)
        .attr("class", "text-slate-100 dark:text-slate-900/60");

      // Label below scale
      ticksGroup.append("text")
        .attr("x", tx)
        .attr("y", nodeY + 22)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .attr("class", "fill-slate-400 dark:fill-slate-500 font-mono")
        .text(timeFormatter(tick));
    });

    // Map point coordinates to prevent absolute crowding
    // To prevent severe overlap on exact same coordinates, we stagger label height
    const timelineData = visiblePoints.map((p, idx) => {
      const cx = xScale(p.date);
      // stagger factor
      let offsetStagger = 0;
      
      // Look back at earlier items near this coordinate
      for (let i = 0; i < idx; i++) {
        const otherX = xScale(visiblePoints[i].date);
        if (Math.abs(cx - otherX) < 65) {
          offsetStagger = (offsetStagger + 1) % 3;
        }
      }

      return {
        ...p,
        cx,
        cy: nodeY,
        lineY: nodeY - 18 - (offsetStagger * 28),
      };
    });

    // Render nodes
    const pointsGroup = svg.append("g").attr("class", "nodes-group");

    timelineData.forEach(p => {
      // Connect milestone flag down to axis
      pointsGroup.append("line")
        .attr("x1", p.cx)
        .attr("y1", p.cy)
        .attr("x2", p.cx)
        .attr("y2", p.lineY + 10)
        .attr("stroke", "currentColor")
        .attr("stroke-width", indexStrokeWidth(p.type))
        .attr("stroke-dasharray", p.type === "future" ? "2 2" : "none")
        .attr("class", indexStrokeColor(p.type));

      // Anchor circle
      const circleR = p.type === "current" ? 7 : p.type === "contact" ? 5 : 5.5;
      
      const dotAnchor = pointsGroup.append("circle")
        .attr("cx", p.cx)
        .attr("cy", p.cy)
        .attr("r", circleR)
        .attr("class", indexAnchorClass(p.type))
        .attr("cursor", "pointer")
        .on("click", (event) => {
          event.stopPropagation();
          setSelectedPoint(p);
        })
        .on("mouseover", function() {
          d3.select(this)
            .transition().duration(150)
            .attr("r", circleR + 2.5);
        })
        .on("mouseout", function() {
          d3.select(this)
            .transition().duration(150)
            .attr("r", circleR);
        });

      if (p.type === "current") {
        // Glowing halo segment
        pointsGroup.append("circle")
          .attr("cx", p.cx)
          .attr("cy", p.cy)
          .attr("r", circleR + 5)
          .attr("fill", "none")
          .attr("stroke", "#3b82f6")
          .attr("stroke-width", 1.5)
          .attr("class", "opacity-40 animate-pulse");
      }

      // Floating label tags
      const textNode = pointsGroup.append("g")
        .attr("transform", `translate(${p.cx}, ${p.lineY})`)
        .attr("cursor", "pointer")
        .on("click", (event) => {
          event.stopPropagation();
          setSelectedPoint(p);
        });

      // Render pill rect backdrops
      const truncName = p.label.length > 20 ? p.label.slice(0, 18) + ".." : p.label;
      const metricsTextWidth = Math.max(75, truncName.length * 6);
      
      textNode.append("rect")
        .attr("x", -metricsTextWidth / 2)
        .attr("y", -11)
        .attr("width", metricsTextWidth)
        .attr("height", 21)
        .attr("rx", 5)
        .attr("class", indexTagBgClass(p.type) + (selectedPoint?.id === p.id ? " stroke-blue-500 dark:stroke-indigo-400 stroke-2" : ""));

      textNode.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 3)
        .attr("font-size", "9.5px")
        .attr("font-weight", p.type === "current" ? "800" : "700")
        .attr("class", indexTextClass(p.type))
        .text(truncName);
    });

    // Helper formatting rules
    function indexStrokeWidth(type: string) {
      if (type === "current") return "2";
      if (type === "contact") return "1.2";
      return "1.5";
    }

    function indexStrokeColor(type: string) {
      if (type === "current") return "text-blue-500 dark:text-blue-400";
      if (type === "contact") return "text-indigo-400 dark:text-indigo-500/80";
      return "text-slate-300 dark:text-slate-700";
    }

    function indexAnchorClass(type: string) {
      if (type === "current") return "fill-white stroke-blue-600 stroke-[3px] dark:fill-slate-900";
      if (type === "future") return "fill-emerald-500 dark:fill-emerald-600 stroke-none";
      if (type === "contact") return "fill-indigo-500 dark:fill-indigo-600 stroke-none";
      return "fill-slate-400 dark:fill-slate-600 stroke-none";
    }

    function indexTextClass(type: string) {
      if (type === "current") return "fill-blue-700 dark:fill-blue-200 font-extrabold";
      if (type === "future") return "fill-emerald-800 dark:fill-emerald-300";
      if (type === "contact") return "fill-indigo-800 dark:fill-indigo-300";
      return "fill-slate-700 dark:fill-slate-300";
    }

    function indexTagBgClass(type: string) {
      if (type === "current") return "fill-blue-50/90 dark:fill-blue-950/90 stroke-blue-200/50 dark:stroke-blue-800/50";
      if (type === "future") return "fill-emerald-50/90 dark:fill-emerald-950/90 stroke-emerald-250/50 dark:stroke-emerald-900/40";
      if (type === "contact") return "fill-indigo-50/90 dark:fill-indigo-950/90 stroke-indigo-200/50 dark:stroke-indigo-900/40";
      return "fill-slate-50/90 dark:fill-slate-900/90 stroke-slate-200/40 dark:stroke-slate-800/40";
    }

  }, [points, dimensions, viewScope, selectedPoint, birthDate, targetDate, results, savedEvents]);

  // Set default selection to current day on mounting or shifting parameters
  useEffect(() => {
    const todayPoint = points.find(p => p.id === "current-day");
    if (todayPoint) {
      setSelectedPoint(todayPoint);
    }
  }, [birthDate, targetDate]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl p-5 sm:p-6 shadow-sm space-y-5 transition-all">
      
      {/* Mini control panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div className="space-y-0.5">
          <h3 className="text-md sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Milestone className="w-5 h-5 text-blue-600" />
            Interactive Life Milestone Scale
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider">
            D3.JS DRIVEN CHRONOLOGIC TIMELINE
          </p>
        </div>

        {/* Scope controller */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200/40 dark:border-slate-800 self-end sm:self-auto">
          <button 
            onClick={() => {
              setViewScope("proximity");
              setSelectedPoint(points.find(p => p.id === "current-day") || null);
            }}
            className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold transition-all cursor-pointer ${
              viewScope === "proximity" 
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-white shadow-xs" 
              : "text-slate-500 hover:text-slate-950 dark:hover:text-neutral-200"
            }`}
          >
            🔍 Proximity View (Adjacent Months)
          </button>
          
          <button 
            onClick={() => {
              setViewScope("life");
              setSelectedPoint(points.find(p => p.id === "current-day") || null);
            }}
            className={`px-3 py-1.5 rounded-md text-[10px] font-extrabold transition-all cursor-pointer ${
              viewScope === "life" 
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-white shadow-xs" 
              : "text-slate-500 hover:text-slate-950 dark:hover:text-neutral-200"
            }`}
          >
            🌍 Full Lifetime Horizon (Born - Future)
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative bg-slate-50/50 dark:bg-slate-950/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 py-3 overflow-x-hidden" ref={containerRef}>
        
        {/* Helper guide */}
        <div className="absolute top-2 right-3 flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none select-none">
          <Info className="w-3 h-3 text-slate-400" />
          Click nodes to inspect milestones
        </div>

        <svg 
          ref={svgRef} 
          width={dimensions.width} 
          height={dimensions.height}
          className="mx-auto block text-slate-800 dark:text-slate-100 overflow-visible"
        >
          {/* Managed by D3 engine */}
        </svg>
      </div>

      {/* Dynamic details drawer */}
      {selectedPoint && (
        <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-250/60 dark:border-slate-800 text-xs shadow-inner flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-3.5 max-w-2xl">
            <div className={`p-3 rounded-lg shrink-0 ${
              selectedPoint.type === "current" 
                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
                : selectedPoint.type === "future"
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                : selectedPoint.type === "contact"
                ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400"
                : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-350"
            }`}>
              {selectedPoint.type === "current" && <Clock className="w-5 h-5 text-blue-600" />}
              {selectedPoint.type === "future" && <Gift className="w-5 h-5 text-emerald-600" />}
              {selectedPoint.type === "contact" && <User className="w-5 h-5 text-indigo-600" />}
              {selectedPoint.type === "milestone" && <Milestone className="w-5 h-5 text-slate-505" />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {selectedPoint.label}
                </span>
                
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                  selectedPoint.type === "current"
                    ? "bg-blue-50 text-blue-600 border-blue-200/50 dark:bg-blue-950/40 dark:text-blue-400"
                    : selectedPoint.type === "future"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200/50 dark:bg-emerald-950/40 dark:text-emerald-400"
                    : selectedPoint.type === "contact"
                    ? "bg-indigo-50 text-indigo-600 border-indigo-200/50 dark:bg-indigo-950/40 dark:text-indigo-400"
                    : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-355"
                }`}>
                  Age {selectedPoint.age}
                </span>
              </div>

              <p className="text-slate-550 dark:text-slate-400 font-semibold italic">
                {selectedPoint.description}
              </p>
            </div>
          </div>

          <div className="text-left md:text-right shrink-0 font-mono space-y-1 border-t border-slate-205 md:border-t-0 pt-3 md:pt-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              COORDINATE DATE
            </span>
            <p className="text-sm font-black text-slate-800 dark:text-white">
              {selectedPoint.date.toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
            <p className="text-[10px] font-semibold text-slate-400 font-sans">
              Born Weekday Shift: {results.weekdayBorn}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
