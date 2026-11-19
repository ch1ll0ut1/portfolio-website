/**
 * The bridge between the hashed CSS Module names and the illustration modules.
 *
 * The illustrations build their DOM in JavaScript, so they cannot write
 * `'ed-row'` and hope: the real class name is hashed at build time. Every
 * builder therefore takes a class map, and this is the one place that knows
 * which hashed name belongs to which role.
 */

import type { FrameClasses } from './dom';
import type { EdithingClasses } from './edithing';
import type { BluereceiptClasses } from './bluereceipt';
import type { SocialbeeClasses } from './socialbee';
import type { EkoClasses } from './eko';
import frame from './frame.module.css';
import edithing from './edithing.module.css';
import bluereceipt from './bluereceipt.module.css';
import socialbee from './socialbee.module.css';
import eko from './eko.module.css';

/** The stage element's own class, applied by CaseVisual. */
export const vizClass = frame.viz;

export const frameClasses: FrameClasses = {
    viz: frame.viz,
    win: frame.win,
    titleBar: frame.titleBar,
    path: frame.path,
    body: frame.body,
    bodyOut: frame.bodyOut,
    chip: frame.chip,
    chipBusy: frame.chipBusy,
    chipOk: frame.chipOk,
    chipErr: frame.chipErr,
    caret: frame.caret,
    caretSolid: frame.caretSolid,
    caretInline: frame.caretInline,
};

export const edithingClasses: EdithingClasses = {
    rows: edithing.rows,
    gutter: edithing.gutter,
    ln: edithing.ln,
    lnOn: edithing.lnOn,
    inner: edithing.inner,
    row: edithing.row,
    rowNew: edithing.rowNew,
    rowGone: edithing.rowGone,
    rowCh: edithing.rowCh,
    rowGr: edithing.rowGr,
    rowMgr: edithing.rowMgr,
    guide: edithing.guide,
    lbl: edithing.lbl,
    lblRenum: edithing.lblRenum,
    bar: edithing.bar,
    sel: edithing.sel,
    caretPos: edithing.caretPos,
    caretTyping: edithing.caretTyping,
    key: edithing.key,
    foot: edithing.foot,
    crumbs: edithing.crumbs,
};

export const bluereceiptClasses: BluereceiptClasses = {
    rail: bluereceipt.rail,
    fill: bluereceipt.fill,
    fillOn: bluereceipt.fillOn,
    node: bluereceipt.node,
    nodeOk: bluereceipt.nodeOk,
    nodeErr: bluereceipt.nodeErr,
    pulse: bluereceipt.pulse,
    card: bluereceipt.card,
    cardFlash: bluereceipt.cardFlash,
    cardErr: bluereceipt.cardErr,
    head: bluereceipt.head,
    st: bluereceipt.st,
    code: bluereceipt.code,
    line: bluereceipt.line,
    tkP: bluereceipt.tkP,
    tkK: bluereceipt.tkK,
    tkT: bluereceipt.tkT,
    tkS: bluereceipt.tkS,
    tkX: bluereceipt.tkX,
    tkSel: bluereceipt.tkSel,
    err: bluereceipt.err,
    errOn: bluereceipt.errOn,
};

export const socialbeeClasses: SocialbeeClasses = {
    stage: socialbee.stage,
    edge: socialbee.edge,
    edgeSys: socialbee.edgeSys,
    edgeDim: socialbee.edgeDim,
    node: socialbee.node,
    nodeOn: socialbee.nodeOn,
    nodePing: socialbee.nodePing,
    nodeHandover: socialbee.nodeHandover,
    person: socialbee.person,
    lead: socialbee.lead,
    sys: socialbee.sys,
    lbl: socialbee.lbl,
    pulse: socialbee.pulse,
    git: socialbee.git,
    gitLbl: socialbee.gitLbl,
    gitLine: socialbee.gitLine,
    gitTrack: socialbee.gitTrack,
    commit: socialbee.commit,
};

export const ekoClasses: EkoClasses = {
    toggle: eko.toggle,
    toggleOn: eko.toggleOn,
    thumb: eko.thumb,
    lane: eko.lane,
    laneLbl: eko.laneLbl,
    laneTrack: eko.laneTrack,
    sink: eko.sink,
    gate: eko.gate,
    gateOpen: eko.gateOpen,
    pill: eko.pill,
    pillWait: eko.pillWait,
    meter: eko.meter,
    meterLbl: eko.meterLbl,
    meterTrack: eko.meterTrack,
    meterFill: eko.meterFill,
    meterVal: eko.meterVal,
    hist: eko.hist,
    bar: eko.bar,
    barAfter: eko.barAfter,
};
