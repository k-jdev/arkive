"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/animations";

type Block =
  | { type: "paragraph"; text: string }
  | { type: "subheading"; label: string; text: string };

type SubSection = {
  id: string;
  title: string;
  blocks: Block[];
};

type Section = {
  id: string;
  title: string;
  intro?: string;
  blocks?: Block[];
  subSections?: SubSection[];
};

const SECTIONS: Section[] = [
  {
    id: "abstract",
    title: "Abstract",
    blocks: [
      {
        type: "paragraph",
        text: "Frontier AI is the most capable tool the world has ever had access to. It can synthesize, reason, recall, and reflect at a higher capacity and across more context than any other source available. However, vendor controlled AI memory decays, locks to a single model, and remains isolated to a single user. Arkive proposes an alternative: an open protocol where AI memory is a structured, portable, collaborative, compounding record under the user's control. This paper outlines Arkive's architecture, its first core practice (Project DeFi), and its economic model.",
      },
    ],
  },
  {
    id: "problem-statement",
    title: "Problem Statement",
    blocks: [
      {
        type: "paragraph",
        text: "Frontier AI's usefulness in any interaction is bounded by what it knows about the user. A model can reason brilliantly, but reasoning without context produces generic output — what most people would want, not what a specific user needs. As AI's reasoning continues to improve, and as it takes on more of the cognitive load in all domains that require said reasoning, context and memory become the binding constraints on the quality of its output. Every memory feature shipped to date has failed to provide an adequate solution for one simple reason: the failures are structural, not incidental. Three main shortcomings recur across every implementation.",
      },
      {
        type: "subheading",
        label: "Decay.",
        text: "Vendor memory is generative, not accumulative. As new information enters, older information is summarized, compressed, or pruned to fit within model context limits. What survives is a lossy resume of what happened, not a complete record. A user who has interacted with a model for two years has a memory representation that bears only a partial resemblance to those two years of actual interaction. Each summarization step discards detail; each discard compounds. The longer the relationship, the less faithful the memory.",
      },
      {
        type: "subheading",
        label: "Lock-in.",
        text: "Vendor memory is bound to the vendor's system. A user who has built up months of context with one model cannot transport that context to another. Switching models means starting over — manually re-explaining preferences, rules, and history, often imperfectly. The cost of switching grows with the depth of the relationship, which makes the relationship increasingly captive. The user becomes a tenant of the vendor's memory rather than the owner of their own.",
      },
      {
        type: "subheading",
        label: "Isolation.",
        text: "Vendor memory is bound to a single user's account. Two people working on the same project, or a team operating under shared rules, cannot share AI memory in any structured way. Each user maintains a separate, partial picture; the AI cannot reason across them. Teams that depend on shared context — investment partners, research groups, distributed organizations — get no help from the memory layer at all.",
      },
      {
        type: "paragraph",
        text: "These are not implementation failures. They are structural consequences of treating AI memory as a vendor product rather than as user-owned infrastructure. Solving them within the existing model is impossible: a vendor that owns and operates its users' memory will always face commercial pressure to summarize aggressively, lock users in, and gate sharing behind product tiers. The interests of the vendor and the interests of the user diverge by design.",
      },
      {
        type: "paragraph",
        text: "What is needed is an alternative substrate — one where AI memory is structured to compound rather than decay, portable across any model, shareable across users where collaboration is wanted, and owned outright by the user. The remainder of this paper outlines such a substrate.",
      },
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    intro:
      "Arkive is an open standard for storing and structuring AI memory. An arkive — the lowercase noun denotes a single user's instance — is a collection of plain markdown files that any frontier model can read and write through the Model Context Protocol. The standard defines how those files are organized, how they update, and how a connected model interacts with them. It does not define the model itself; the intelligence belongs to whichever AI the user connects. The architecture rests on four ideas, treated in turn below. An arkive is built from a small set of structured components, each holding a different kind of information. Those components update through a continuous loop that turns raw activity into refined behavior. The arkive extends into any domain through practices. And the whole structure connects to frontier AI through a single open protocol, leaving the user free to choose, switch, or combine models at will.",
    subSections: [
      {
        id: "arkives",
        title: "Arkives",
        blocks: [
          {
            type: "paragraph",
            text: "An arkive is a structured set of plain markdown files stored on the user's machine, in a hosted instance, or both. Because the format is plain text, an arkive is human-readable, version-controllable, and exportable as a single folder at any time. There is no proprietary database, no opaque encoding, and no dependency on Arkive's own infrastructure to read or move it. This is a deliberate constraint: a memory standard that aims to be universal and user-owned cannot rest on a format only its author can interpret.",
          },
          {
            type: "paragraph",
            text: "An arkive is organized into four components, each holding a distinct kind of information.",
          },
          {
            type: "subheading",
            label: "Journal.",
            text: "The journal is the complete, append-only record of what has happened — raw data, conversations, decisions, and their outcomes. Nothing in the journal is summarized or overwritten; entries are added, never edited away. The journal is the source of truth from which everything else in the arkive is derived, and the foundation on which context compounds rather than decays.",
          },
          {
            type: "subheading",
            label: "Context.",
            text: "Context holds the current state of affairs: the rules, priorities, and working information a model needs at the start of any interaction. Where the journal is a historical record, context is a live snapshot — what is true now. It is read at the beginning of a session so the connected model operates from an accurate picture of the present rather than reconstructing it from raw history each time.",
          },
          {
            type: "subheading",
            label: "Insights.",
            text: "Insights are patterns the connected model surfaces from the journal and context — recurring behaviors, anomalies, or observations the user may not have noticed. Critically, an insight is not applied automatically. It is a proposal: a suggested change to the arkive's rules, skills, or context that the user must approve before it takes effect.",
          },
          {
            type: "subheading",
            label: "Skills.",
            text: "Skills are the connected model's evolving instructions for how to act in specific scenarios. Where context describes what is true, skills describe what to do. They are refined over time as insights are accepted, so the model's behavior sharpens with use rather than remaining static. Each skill is a discrete, inspectable instruction the user can review, edit, or revert.",
          },
          {
            type: "paragraph",
            text: "The separation matters. By isolating the historical record (journal) from the current state (context), the proposed changes (insights) from the standing behavior (skills), an arkive keeps each kind of information in a form suited to how it is used. The journal can grow without bound because it is never read in full; context stays small because it holds only what is current; insights remain auditable because they are explicit proposals rather than silent edits; and skills stay coherent because they are versioned instructions rather than an ever-growing pile of rules. The structure is what allows the arkive to compound without becoming unwieldy.",
          },
        ],
      },
      {
        id: "compounding-loop",
        title: "The Compounding Loop",
        blocks: [
          {
            type: "paragraph",
            text: "The four components are not static stores; they update through a continuous cycle. Each pass through the cycle leaves the connected model better equipped for the next interaction, and because nothing is discarded, each improvement builds on every improvement before it. This is what distinguishes compounding from mere accumulation: the arkive does not simply hold more over time, it becomes more useful over time. The cycle has four stages.",
          },
          {
            type: "subheading",
            label: "Record.",
            text: "Every interaction is logged to the journal — the trade placed, the decision made, the conversation held, the outcome observed. Recording is continuous and automatic; the user does not curate what enters the journal any more than a bank statement is curated. In parallel, context stays current as the state of affairs changes, so the model's working picture of the present reflects what is now true.",
          },
          {
            type: "subheading",
            label: "Notice.",
            text: "Against the growing journal and the current context, the connected model surfaces patterns — a recurring behavior, a deviation from a stated rule, a thesis that keeps recurring across decisions. These observations become insights: explicit, reviewable proposals rather than silent adjustments.",
          },
          {
            type: "subheading",
            label: "Learn.",
            text: "Insights the user accepts become changes to the arkive — a refined skill, a new rule, an updated priority. Because these changes pass through the user, the arkive learns in a direction the user endorses, not one inferred and applied without consent. What the model does next is shaped by what the user has approved.",
          },
          {
            type: "subheading",
            label: "Improve.",
            text: "The next interaction begins from the updated arkive. Skills are sharper, context is current, and the journal is longer and more informative than before. The model's output improves accordingly — and the cycle begins again from a higher starting point.",
          },
          {
            type: "paragraph",
            text: "Over many cycles, the effect compounds. An arkive that has run this loop for a year is not a year's worth of stored conversations; it is a year's worth of refinements, each built on the last, expressed in skills and context that make every subsequent interaction more precise. The longer the arkive runs, the larger the gap between it and a model operating without one.",
          },
        ],
      },
      {
        id: "practices",
        title: "Practices",
        blocks: [
          {
            type: "paragraph",
            text: "A single arkive is not confined to one kind of work. It extends into any domain through practices — self-contained configurations of the four components, each shaped to a specific activity. A trading practice and a research practice share the same underlying structure, but their contents differ entirely: the trading practice's context holds open positions and risk limits, while the research practice's context holds open questions and source criteria. The journal, insights, and skills adapt in the same way. The structure is universal; what fills it is domain-specific.",
          },
          {
            type: "paragraph",
            text: "Practices are not a fixed catalog. Because a practice is just a structured arrangement of the same four components, any practice can be created on demand — a user describes the domain to their connected model, and the model establishes the practice's initial structure. There is no predefined list of supported activities, and no limit to how many practices a single arkive can hold. Trading, research, writing, fitness, business operations — each is a practice, and so is anything else a user chooses to track.",
          },
          {
            type: "paragraph",
            text: "Among these, a distinction matters. Core practices are those Arkive builds and maintains directly — flagship applications of the protocol, developed to a higher standard and, where applicable, connected to external systems. Project DeFi, described later in this paper, is the first core practice: Arkive applied to on-chain trading, with a full execution layer behind it. User-created practices are everything else — the open-ended practices any user can create for any domain. Both run on the same protocol and the same component structure; core practices are distinguished by Arkive's direct development and the external integrations they carry, not by any difference in the underlying standard.",
          },
          {
            type: "paragraph",
            text: "A practice need not belong to a single user. Because an arkive is a set of structured files, a practice can be shared across multiple users, who then work within it together — proposing changes, refining skills, and building shared context. Every change is recorded in a tamper-resistant audit log, attributed to the user who made it; because this log is maintained server-side rather than within the arkive's own files, it cannot be silently altered by the users it records. Access is scoped per user: a collaborator may be granted permission to read a practice, to approve changes proposed by others, to edit a practice, or to grant other users permissions, with each role set independently per practice. This makes a practice a viable substrate not only for an individual's work but for a team's: investment partners operating under shared rules, a research group building a common body of knowledge, an organization maintaining institutional memory that persists as individuals come and go. The infrastructure that makes real-time collaboration practical is addressed in the section on Arkive's business model.",
          },
        ],
      },
      {
        id: "mcp-integration",
        title: "MCP Integration",
        blocks: [
          {
            type: "paragraph",
            text: "An arkive is only useful when a model can read and write it. That connection is made through the Model Context Protocol (MCP) — an open standard for linking frontier AI to external tools and data. Arkive is built on MCP natively: the protocol defines how a connected model retrieves context at the start of a session, appends to the journal, proposes insights, and reads the skills that govern its behavior. Any model that speaks MCP can operate an arkive without bespoke integration.",
          },
          {
            type: "paragraph",
            text: "This choice has a direct consequence for the user. Because the connection is made through an open protocol rather than a proprietary API, the user is free to choose which model operates their arkive — and to change that choice at any time. The same arkive can be driven by one frontier model today and a different one tomorrow, with no migration and no loss of context. The arkive is the constant; the model is interchangeable.",
          },
          {
            type: "paragraph",
            text: "Different models reason differently, and the user is the one positioned to judge which reasoning suits a given practice. A user may prefer one model for the open-ended exploration of a research practice and another for the disciplined execution of a trading practice; they may connect several models at once and route between them. None of this requires the user to rebuild their context, because the context does not live in the model. It lives in the arkive, and the model reaches it through MCP.",
          },
          {
            type: "paragraph",
            text: "Building on MCP also aligns Arkive with the direction the broader ecosystem is already moving. As an open standard adopted across the industry for connecting AI to external systems, MCP means that each new model and each new MCP-compatible tool extends what an arkive can do, without any change to the arkive itself. Arkive does not have to anticipate every model or integration in advance; it inherits them as artificial intelligence evolves.",
          },
        ],
      },
      {
        id: "design-philosophy",
        title: "Design Philosophy",
        blocks: [
          {
            type: "paragraph",
            text: "The Problem section argued that vendor memory fails for a structural reason: when a single party owns the model, the memory, and the commercial relationship, its incentives diverge from the user's. Aggressive summarization and lock-in are not accidents — they are the rational behavior of a party that profits from them. A protocol that means to avoid these failures cannot simply promise better behavior; it must be built so that reproducing the failures is structurally counter-productive. Three principles guide Arkive's architecture toward that end.",
          },
          {
            type: "subheading",
            label: "The user's AI, not ours.",
            text: "Arkive does not generate intelligence. It connects the user's existing AI to their arkive, providing the full context and memory structure that model needs to be useful. The user's choice of model is part of the configuration, not something Arkive supplies or controls. This is a deliberate separation of concerns: by refusing to be the intelligence layer, Arkive removes its own incentive to lock users into a particular model, and leaves the user with the full intelligence of frontier AI, applied specifically in the way they need it. The result is a system whose value comes from structuring context well, not from owning the model that reads it.",
          },
          {
            type: "subheading",
            label: "The user's data, not ours.",
            text: "An arkive is a set of plain markdown files, exportable in a single folder at any time. Portable, AI-readable, collaborative as needed, and fully the user's. This is not a policy commitment that Arkive could quietly revise; it is a property of the format. Because an arkive is plain text, readable and exportable without Arkive's infrastructure, the user is never captive — a fact guaranteed by the architecture rather than by Arkive's goodwill. Ownership, here, is enforced by design — and it keeps Arkive's incentives pointed at serving the user rather than trapping them.",
          },
          {
            type: "subheading",
            label: "The user's signature, not the AI's.",
            text: "Every consequential action requires the user's explicit approval. This applies across the system — state changes, behavioral updates, and anything that affects the user or alters how the connected AI acts. Insights are proposed, not applied; skills change only when the user accepts the change. In core practices that act on the outside world, the same principle governs real-world actions: in The DeFi Project, discussed later in this paper, trades are presented to the user and executed only once signed. An AI granted deep context and broad capability is only as trustworthy as the controls around it; by making user approval the gate on every consequential action, Arkive ensures that the model's growing capability never translates into autonomous authority.",
          },
          {
            type: "paragraph",
            text: "Taken together, the three principles describe a system designed to stay aligned with its user even as it grows more capable. The first two attack the root of the vendor-misalignment problem directly: by owning neither the model nor the data, Arkive forecloses the incentives that drive memory to decay, lock in, and isolate. The third adds what an aligned memory layer still requires once it works — a guarantee that a deeply-contextualized, highly-capable model remains under the user's control. Each principle resolves its concern by structure rather than by promise.",
          },
        ],
      },
      {
        id: "project-defi",
        title: "Project DeFi",
        blocks: [
          {
            type: "paragraph",
            text: "Arkive's value is easiest to demonstrate where the feedback is fastest. Project DeFi, Arkive's first core practice, applies the protocol to on-chain trading — a domain chosen deliberately, because trading produces clear, measurable outcomes on short timescales. A thesis is either confirmed or refuted by the market within hours or days; a rule is either followed or broken on every trade. In a domain this unforgiving, the difference between an AI operating with full context and one operating without it is immediate and quantifiable.",
          },
          {
            type: "paragraph",
            text: "Applied to trading, the four components of an arkive take on concrete form. The journal records each trade, the reasoning behind it, and its outcome. Context holds the live state of the account: open positions, available capital, watchlist, and the rules the trader operates under. Insights surface patterns from that history — a setup the trader keeps mistiming, a rule being ignored, a position size that correlates with losses — and propose changes for approval. Skills encode how the connected model acts in specific trading scenarios, refined as the trader accepts insights over time. The structure is identical to any other arkive; only its contents are specific to trading.",
          },
          {
            type: "paragraph",
            text: 'Trading on Arkive happens in conversation. The trader can prompt the connected model for a specific trade — "open a 2x long on SOL" — or describe an intent and let the model propose one: "I think SOL is going up soon, suggest a trade." In both cases, the proposal is shaped by the arkive, the model\'s access to external context, and the model\'s reasoning. A model that knows the trader\'s rules, history, and current exposure proposes trades against everything the trader has done and committed to. This is where context becomes consequential. Asked to open a position that exceeds a self-imposed leverage limit, for example, the model does not simply comply — it surfaces the conflict, cites the rule and the journal entry behind it, and leaves the decision to the trader.',
          },
          {
            type: "paragraph",
            text: "No trade reaches the market on the model's authority. Every transaction is presented to the trader as a proposal, reviewed, and executed only once the trader signs it. This is the user's signature principle in its most consequential form: the connected model can analyze, recommend, and prepare a transaction in full, but the act of committing capital remains the trader's alone. The model's growing command of the trader's context raises the quality of what it proposes; it never expands what it can do without permission.",
          },
          {
            type: "paragraph",
            text: "The result is the full intelligence of frontier AI, integrated directly into on-chain trading. The connected model brings its complete reasoning capacity to each decision, applied through the trader's own history, rules, and context rather than in isolation. Because the practice compounds, that intelligence grows sharper and more specific to the trader over time. Project DeFi acts as the first proof that an arkive makes a connected model measurably more effective at a real task.",
          },
        ],
      },
      {
        id: "business-model",
        title: "Business Model & $ARK Token",
        blocks: [
          {
            type: "paragraph",
            text: "Arkive monetizes the hosted operation of an open protocol, not the protocol itself. The format is free, self-hostable, and exportable; what Arkive offers as a business is the hosted infrastructure that makes an arkive practical to run at scale — storage, synchronization, the canonical MCP implementation, and the server-side infrastructure behind collaboration. This is the same pattern that has produced durable businesses atop other open standards: the standard remains free, and the company earns by granting users the ability to appropriately operate on it. Revenue comes from two sources — subscriptions and practice fees — with a token, $ARK, layered across both.",
          },
          {
            type: "subheading",
            label: "Subscriptions.",
            text: "Hosted access is offered in three tiers, distinguished by the infrastructure each provides and the scale it supports. The Basic tier is free. It includes 5 GB of hosted storage, standard rate limits on MCP requests, and manual export for sharing an arkive. It is a complete, usable Arkive for an individual. The Pro tier, at $29 per month, adds the infrastructure that makes collaboration possible: real-time synchronization across users, per-practice permissions, and a tamper-resistant, server-side audit log of every change. It raises storage to 50 GB and provides higher MCP rate limits with priority handling under load. Pro is the tier at which an arkive becomes a shared instrument rather than a personal one. The Enterprise tier is priced by arrangement and is built for organizations operating at scale. It extends Pro's collaboration with organization-wide administration, audit-log export to external compliance systems, dedicated infrastructure with service-level guarantees, and storage beginning at 500 GB. These are not new capabilities so much as the operational, security, and compliance guarantees a serious organization requires before it can adopt the protocol at all.",
          },
          {
            type: "subheading",
            label: "Practice fees.",
            text: "Core practices that route real-world activity carry a volume-based fee. Project DeFi is the first: a percentage fee on the value of trades executed through the practice, scaled by tier — 1% at Basic, 0.5% at Pro, and 0% at Enterprise. The fee falls as the subscription rises, so the trader doing meaningful volume is steadily better off on a higher tier. This is the mechanism by which a transactional core practice monetizes proportionally to the value it routes, rather than through a flat charge that bears no relation to use. Future core practices that act on the outside world will carry their own fee structures, set to the activity they route.",
          },
          {
            type: "subheading",
            label: "$ARK.",
            text: "$ARK is the native token of the Arkive protocol. Its role is deliberately narrow. A portion of all revenue, from both subscriptions and practice fees, is directed to buying $ARK on the open market and burning it. $ARK has a fixed supply of 1,000,000 tokens with no transfer tax, and its initial liquidity is seeded on Base, with additional pools opened on other chains over time.",
          },
          {
            type: "paragraph",
            text: "The structure of this model follows from the design philosophy. Because an arkive can be exported and self-hosted, Arkive cannot retain users by trapping them — and does not try to. Retention comes instead from the arkive itself: a record that compounds in value the longer it runs, accruing entirely to the user who owns it. The result is a business whose interests stay pointed in the same direction as its users' — Arkive succeeds by making the hosted experience worth paying for, and by building core practices valuable enough to route real activity through, not by holding anyone's data hostage. The open standard is what makes that alignment credible; the hosted product and its practices are what make it a business.",
          },
        ],
      },
      {
        id: "conclusion",
        title: "Conclusion",
        blocks: [
          {
            type: "paragraph",
            text: "AI memory is broken in ways that better products cannot fix, because the failures are structural. As long as a single party owns the model, the memory, and the commercial relationship, that memory will decay, lock in, and isolate — not by accident, but because those outcomes serve the party that controls it. The problem is not a missing feature. It is a question of who owns the context.",
          },
          {
            type: "paragraph",
            text: "Arkive answers that question by making AI memory an open standard rather than a vendor product. An arkive is a structured, plain-text record that any frontier model can read, that compounds rather than decays, that moves freely across models, that can be shared across users, and that belongs to the user outright. The intelligence remains the model's; the data remains the user's; and every consequential action remains the user's to authorize. These are not commitments Arkive makes and could later revise — they are properties of how the protocol is built.",
          },
          {
            type: "paragraph",
            text: "Project DeFi demonstrates the result in the most demanding domain available, where the value of context is measured in real outcomes on short timescales. But trading is only the first application. The same structure — context that compounds, portable across models, owned by the user — applies to any domain where decisions accumulate and history matters.",
          },
          {
            type: "paragraph",
            text: "As frontier AI grows more capable, the constraint on its usefulness shifts from the intelligence of the model to the quality of the context it can bring to bear. Arkive is the standard for that context: the layer that turns a capable model into one that knows the user it works for.",
          },
        ],
      },
      {
        id: "legal-disclaimer",
        title: "Legal Disclaimer",
        blocks: [
          {
            type: "subheading",
            label: "No offer of securities or investment.",
            text: "This document is provided for informational purposes only. Nothing in it constitutes an offer to sell, a solicitation of an offer to buy, or a recommendation regarding any security, token, financial instrument, or investment, in any jurisdiction. Nothing herein should be construed as financial, legal, tax, accounting, or investment advice. $ARK is intended to function as a utility token for use within the Arkive protocol and is not offered or intended as an investment, share, equity interest, or claim on any profits, assets, or revenue of any person or entity.",
          },
          {
            type: "subheading",
            label: "No reliance.",
            text: "This document does not form the basis of, and should not be relied upon in connection with, any contract, purchase, or investment decision. Readers should not act or refrain from acting on the basis of any content in this document without conducting their own independent research and obtaining independent professional advice appropriate to their circumstances and jurisdiction.",
          },
          {
            type: "subheading",
            label: "Forward-looking statements.",
            text: "This document contains forward-looking statements regarding intended features, plans, designs, and objectives. These statements reflect current intentions only, involve known and unknown risks and uncertainties, and are subject to change without notice. The protocol, its architecture, its economic model, the $ARK token, pricing, fee structures, timelines, and any described functionality may be modified, delayed, or abandoned entirely at any time and for any reason. No statement herein is a promise, guarantee, or commitment that any feature, outcome, valuation, or result will be achieved. Actual outcomes may differ materially from those described.",
          },
          {
            type: "subheading",
            label: "No warranties.",
            text: 'This document and any associated software, protocol, or service are provided "as is" and "as available," without warranties of any kind, whether express, implied, statutory, or otherwise, including without limitation any implied warranties of merchantability, fitness for a particular purpose, title, accuracy, or non-infringement. No representation or warranty is made as to the accuracy, completeness, reliability, or currency of any information in this document.',
          },
          {
            type: "subheading",
            label: "Assumption of risk.",
            text: "Use of the Arkive protocol, any practice built on it, the $ARK token, and any associated software is undertaken entirely at the user's own risk. Digital assets and on-chain activity involve substantial risk, including the total loss of funds. Project DeFi and any other core or user-created practice that routes real-world activity may result in financial loss. Users are solely responsible for their own decisions, transactions, signatures, configurations, tax obligations, and compliance with all applicable laws in their jurisdiction.",
          },
          {
            type: "subheading",
            label: "Limitation of liability.",
            text: "To the maximum extent permitted by applicable law, neither Arkive, nor its founders, contributors, employees, agents, affiliates, or associated parties shall be liable for any direct, indirect, incidental, special, consequential, exemplary, or punitive damages, or for any loss of profits, revenue, data, funds, or digital assets, arising out of or in connection with this document, the Arkive protocol, the $ARK token, any practice, or any associated software or service — whether based on contract, tort, strict liability, or any other theory, and whether or not advised of the possibility of such damages.",
          },
          {
            type: "subheading",
            label: "No fiduciary or advisory relationship.",
            text: "Nothing in this document creates any fiduciary, advisory, agency, partnership, or similar relationship between Arkive and any reader or user. Arkive does not act as a broker, dealer, investment adviser, financial adviser, or custodian, and provides no personalized advice of any kind.",
          },
          {
            type: "subheading",
            label: "Regulatory uncertainty.",
            text: "The regulatory treatment of digital assets, tokens, and decentralized protocols is evolving and varies by jurisdiction. The protocol and the $ARK token may be subject to regulatory action, restriction, or prohibition in certain jurisdictions. It is the reader's sole responsibility to determine whether their access to or use of the protocol or token is lawful in their jurisdiction, and to comply with all applicable laws, including securities, tax, anti-money-laundering, and sanctions requirements. The protocol and token are not directed at, and may not be available to, persons in jurisdictions where such access or use would be unlawful.",
          },
          {
            type: "subheading",
            label: "Third-party content and models.",
            text: "The Arkive protocol connects user-selected, third-party AI models through the Model Context Protocol. Arkive does not control, operate, or take responsibility for the outputs, behavior, availability, or reliability of any third-party model, tool, or service. AI-generated outputs may be inaccurate, incomplete, or unsuitable, and are not a substitute for the user's own judgment. Any reliance on a connected model's output is at the user's own risk.",
          },
          {
            type: "subheading",
            label: "Translations and interpretation.",
            text: "In the event this document is translated into any other language, the original English version shall prevail in the event of any conflict or inconsistency. Section headings are for convenience only and do not affect interpretation.",
          },
          {
            type: "subheading",
            label: "Amendment.",
            text: "This document may be amended, updated, or replaced at any time without notice. The most current version supersedes all prior versions.",
          },
        ],
      },
    ],
  },
];

function BlockRenderer({ block }: { block: Block }) {
  if (block.type === "paragraph") {
    return (
      <p className="text-sm leading-[20px] font-medium text-[#696e77]">
        {block.text}
      </p>
    );
  }
  return (
    <p className="text-sm leading-[20px] font-medium text-[#696e77]">
      <span className="text-[#141414] font-semibold">{block.label} </span>
      {block.text}
    </p>
  );
}

function SubSectionBlock({
  title,
  blocks,
  index,
}: {
  title: string;
  blocks: Block[];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.05 }}
      className="flex flex-col gap-4"
    >
      <h3 className="text-[20px] leading-[26px] tracking-[-0.1px] font-medium text-[#141414]">
        {title}
      </h3>
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </motion.div>
  );
}

function SectionBlock({
  title,
  intro,
  blocks,
  subSections,
  index,
}: {
  title: string;
  intro?: string;
  blocks?: Block[];
  subSections?: SubSection[];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.05 }}
      className="flex flex-col gap-6"
    >
      <h2 className="text-[24px] leading-[30px] tracking-[-0.1px] font-medium text-[#141414]">
        {title}
      </h2>
      {intro && (
        <p className="text-sm leading-[20px] font-medium text-[#696e77]">
          {intro}
        </p>
      )}
      {blocks && (
        <div className="flex flex-col gap-4">
          {blocks.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
        </div>
      )}
      {subSections && (
        <div className="flex flex-col gap-8">
          {subSections.map((sub, i) => (
            <SubSectionBlock
              key={sub.id}
              title={sub.title}
              blocks={sub.blocks}
              index={i}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function LitepaperContent() {
  return (
    <section className="w-full bg-white">
      <div className="max-w-360 mx-auto px-[clamp(16px,4.17vw,80px)] pb-[clamp(48px,6vw,120px)] pt-[40px]">
        <div className="mx-auto max-w-140 flex flex-col gap-[40px]">
          {SECTIONS.map((section, i) => (
            <SectionBlock
              key={section.id}
              title={section.title}
              intro={section.intro}
              blocks={section.blocks}
              subSections={section.subSections}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
