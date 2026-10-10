import { nextSetDraft, parseSet, suggestWorkoutDay, type SuggestableWorkoutDay } from './session';

const TREINO_A: SuggestableWorkoutDay = { id: 'day-a', name: 'Treino A', weekday: 1 };
const TREINO_B: SuggestableWorkoutDay = { id: 'day-b', name: 'Treino B', weekday: 3 };
const TREINO_C: SuggestableWorkoutDay = { id: 'day-c', name: 'Treino C', weekday: 5 };
const ABC = [TREINO_A, TREINO_B, TREINO_C];

const SUPERIORES_1: SuggestableWorkoutDay = { id: 'upper-1', name: 'Superiores 1', weekday: 1 };
const INFERIORES_1: SuggestableWorkoutDay = { id: 'lower-1', name: 'Inferiores 1', weekday: 2 };

function at(year: number, month: number, day: number, hour = 12, minute = 0): Date {
  return new Date(year, month - 1, day, hour, minute);
}

test('segunda sem sessão concluída sugere Treino A', () => {
  expect(suggestWorkoutDay(ABC, [], at(2026, 10, 5))).toEqual(TREINO_A);
});

test('terça sem o primeiro feito continua em Treino A', () => {
  expect(suggestWorkoutDay(ABC, [], at(2026, 10, 6))).toEqual(TREINO_A);
});

test('terça com Treino A concluído na segunda sugere Treino B', () => {
  const completed = [{ workoutDayId: TREINO_A.id, startedAt: at(2026, 10, 5, 18) }];
  expect(suggestWorkoutDay(ABC, completed, at(2026, 10, 6))).toEqual(TREINO_B);
});

test('dia pulado continua pendente: só B feito na quinta ainda sugere A', () => {
  const completed = [{ workoutDayId: TREINO_B.id, startedAt: at(2026, 10, 8, 9) }];
  expect(suggestWorkoutDay(ABC, completed, at(2026, 10, 8))).toEqual(TREINO_A);
});

test('sábado com A, B e C concluídos não tem sugestão', () => {
  const completed = [
    { workoutDayId: TREINO_A.id, startedAt: at(2026, 10, 5, 18) },
    { workoutDayId: TREINO_B.id, startedAt: at(2026, 10, 7, 18) },
    { workoutDayId: TREINO_C.id, startedAt: at(2026, 10, 9, 18) },
  ];
  expect(suggestWorkoutDay(ABC, completed, at(2026, 10, 10))).toBeNull();
});

test('segunda seguinte recomeça em Treino A', () => {
  const completed = [
    { workoutDayId: TREINO_A.id, startedAt: at(2026, 10, 5, 18) },
    { workoutDayId: TREINO_B.id, startedAt: at(2026, 10, 7, 18) },
    { workoutDayId: TREINO_C.id, startedAt: at(2026, 10, 9, 18) },
  ];
  expect(suggestWorkoutDay(ABC, completed, at(2026, 10, 12))).toEqual(TREINO_A);
});

test('sessão de domingo 23:00 não conta na segunda', () => {
  const completed = [{ workoutDayId: TREINO_A.id, startedAt: at(2026, 10, 11, 23, 0) }];
  expect(suggestWorkoutDay(ABC, completed, at(2026, 10, 12, 8))).toEqual(TREINO_A);
});

test('sessão na segunda 00:10 entra na semana nova e sugere Treino B', () => {
  const completed = [{ workoutDayId: TREINO_A.id, startedAt: at(2026, 10, 12, 0, 10) }];
  expect(suggestWorkoutDay(ABC, completed, at(2026, 10, 12, 12))).toEqual(TREINO_B);
});

test('sessão só em andamento não entra na lista e a sugestão continua Treino A', () => {
  expect(suggestWorkoutDay(ABC, [], at(2026, 10, 6))).toEqual(TREINO_A);
});

test('sessão de plano arquivado não entra na lista do plano ativo', () => {
  const activeDays = [SUPERIORES_1, INFERIORES_1];
  expect(suggestWorkoutDay(activeDays, [], at(2026, 10, 6))).toEqual(SUPERIORES_1);
});

test('sem dias de treino não há sugestão', () => {
  expect(suggestWorkoutDay([], [], at(2026, 10, 5))).toBeNull();
});

test('a semana local vai de segunda 00:00 inclusive até a próxima segunda exclusiva', () => {
  const completed = [{ workoutDayId: TREINO_A.id, startedAt: at(2026, 10, 12, 0, 0) }];
  expect(suggestWorkoutDay(ABC, completed, at(2026, 10, 12, 0, 0))).toEqual(TREINO_B);
  expect(suggestWorkoutDay(ABC, completed, at(2026, 10, 11, 23, 59))).toEqual(TREINO_A);
});

test('supino grava 10 repetições e 60 kg, sem somar a barra', () => {
  expect(parseSet(10, 60, 'barra')).toEqual({ ok: true, set: { reps: 10, weightKg: 60 } });
});

test('halter grava 12 repetições e 22 kg, sem duplicar', () => {
  expect(parseSet(12, 22, 'halter')).toEqual({ ok: true, set: { reps: 12, weightKg: 22 } });
});

test('flexão grava 15 repetições e 0 kg', () => {
  expect(parseSet(15, 0, 'peso corporal')).toEqual({ ok: true, set: { reps: 15, weightKg: 0 } });
});

test('0 kg, 0 reps e carga negativa são rejeitados e não apagam 10/60', () => {
  const saved = parseSet(10, 60, 'barra');
  expect(parseSet(10, 0, 'barra')).toEqual({ ok: false });
  expect(parseSet(0, 60, 'barra')).toEqual({ ok: false });
  expect(parseSet(8, -5, 'barra')).toEqual({ ok: false });
  expect(saved).toEqual({ ok: true, set: { reps: 10, weightKg: 60 } });
});

test('vírgula e ponto gravam 62,5 como 62.5', () => {
  expect(parseSet(8, '62,5', 'máquina')).toEqual({ ok: true, set: { reps: 8, weightKg: 62.5 } });
  expect(parseSet(8, '62.5', 'cabo')).toEqual({ ok: true, set: { reps: 8, weightKg: 62.5 } });
});

test('máquina e cabo recusam carga zero', () => {
  expect(parseSet(10, 0, 'máquina')).toEqual({ ok: false });
  expect(parseSet(10, '0', 'cabo')).toEqual({ ok: false });
});

test('a segunda série oferece 10 e 60', () => {
  expect(nextSetDraft({ reps: 10, weightKg: 60 }, { repMin: 8, weightKg: 40 })).toEqual({
    reps: '10',
    weightKg: '60',
  });
});

test('a primeira série oferece 8 e 60 quando a meta é 8–12 e 60 kg', () => {
  expect(nextSetDraft(null, { repMin: 8, weightKg: 60 })).toEqual({ reps: '8', weightKg: '60' });
});

test('meta só de 3 séries e 60 kg oferece 60 kg com reps vazias', () => {
  expect(nextSetDraft(null, { repMin: null, weightKg: 60 })).toEqual({ reps: '', weightKg: '60' });
});

test('sem meta e sem série anterior o rascunho fica vazio', () => {
  expect(nextSetDraft(null, null)).toEqual({ reps: '', weightKg: '' });
});
