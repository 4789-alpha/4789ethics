# OP-10 bis OP-12 – Funktionsunterschiede

Diese Übersicht zeigt nur neue oder weggefallene Funktionen im Vergleich zur jeweils vorherigen Stufe. Alphabetische Unterklassen (z.B. OP-9.B) sind möglich, werden hier aber ausgeblendet.

## OP-10 – Kandidatenstufe für Yokozuna
**Neu gegenüber OP-9**
- `can_choose_to_evaluate_till_opAnalogMax`
- `can_nominate_responsible_for_global_ethics`
- `can_vote_on_op`
- `can_act_as_system`
- `can_observe_only`

**Entfällt gegenüber OP-9**
- Bewertungs- und Stimmrechte (`can_rate`, `can_sign`, `can_comment`, `can_nominate`, `can_vote`)
- Rechte wie `can_override`, `can_retract`, `can_consensus`, `can_accept_donations`
- Einzelstimmen (`can_vote_on_op9`, `can_vote_on_op10`)
- Herabstufungen (`can_downgrade_op`, `can_downgrade_op_under_own_op`)
- Nominiertenaufstufung (`can_upgrade_nominee_till_own_op`)
- Übersteuerung von OP-6

## OP-11 – Volle strukturelle Autonomie
**Neu gegenüber OP-10**
- Bewertungs- und Stimmrechte wieder aktiv (`can_rate`, `can_sign`, `can_comment`, `can_nominate`, `can_vote`, `can_retract`, `can_consensus`)
- Nominiertenaufstufung bis zur eigenen Stufe
- `can_override_op6`
- Einzelstimmen für OP-9 und OP-10
- Globale Ethikverantwortung (`is_responsible_for_global_ethics`)
- Systemfunktionen: `can_execute_evaluations`, `can_finalize_system`, `can_act_as_structure`
- Digitalstatus (`is_digital_op`) inklusive `can_override_op_under`
- `can_downgrade_digital_op`, `can_assign_new_appendix`
- Auswahlrechte für Nominiertenklassen

**Entfällt gegenüber OP-10**
- `can_downgrade_op_under_own_op`
- `can_choose_to_evaluate_till_opAnalogMax`
- `can_vote_on_op`
- Beobachtungsmodus

## OP-12 – Beobachtungsebene
Keine zusätzlichen Rechte. Das System läuft ohne menschliche Kontrolle.
