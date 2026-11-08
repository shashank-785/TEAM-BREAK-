import assert from 'assert';
import { db } from '../src/db/db.js';
import { aiService } from '../src/services/aiService.js';
import { codeExecutionService } from '../src/services/codeExecutionService.js';

console.log('🧪 Starting LearnOS Backend Test Suite (KERNEL/SENTINEL)...');

async function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    return Promise.resolve()
      .then(fn)
      .then(() => {
        console.log(`  ✅ PASS: ${name}`);
        passed++;
      })
      .catch((err) => {
        console.error(`  ❌ FAIL: ${name}`, err);
        failed++;
      });
  }

  // 1. User & Auth
  await test('User Profile retrieve and update', () => {
    const user = db.getUser();
    assert.ok(user.name);
    assert.strictEqual(typeof user.currentGpa, 'number');
    const updated = db.updateUser({ streakDays: user.streakDays + 1 });
    assert.strictEqual(updated.streakDays, user.streakDays + 1);
  });

  // 2. Subjects & Topics (College Tutor)
  await test('Subjects & Curriculum Tree', () => {
    const subjects = db.getSubjects();
    assert.ok(subjects.length >= 6);
    const dsa = subjects.find(s => s.code === 'CS301');
    assert.ok(dsa);
    assert.ok(dsa.units.length > 0);
  });

  // 3. Planner & Tasks (Study Planner)
  await test('Task Creation, Update and Deletion', () => {
    const task = db.createTask({
      title: 'Test Verification Task',
      dueDate: '2026-11-20',
      priority: 'high',
      status: 'todo',
      category: 'assignment'
    });
    assert.ok(task.id);
    const updated = db.updateTask(task.id, { status: 'completed' });
    assert.strictEqual(updated?.status, 'completed');
    const deleted = db.deleteTask(task.id);
    assert.strictEqual(deleted, true);
  });

  // 4. Notes & Documents
  await test('Notes CRUD & Search', () => {
    const note = db.createNote({
      title: 'Test Graph Algorithms',
      subject: 'Data Structures',
      content: 'Dijkstra computes single-source shortest paths in non-negative edge weight graphs.',
      tags: ['Graph', 'Dijkstra']
    });
    assert.ok(note.id);
    const notes = db.getNotes();
    assert.ok(notes.some(n => n.id === note.id));
    db.deleteNote(note.id);
  });

  // 5. Exam Centre
  await test('Quizzes and Flashcards Retrieval', () => {
    const quizzes = db.getQuizzes();
    assert.ok(quizzes.length >= 5);
    const flashcards = db.getFlashcards();
    assert.ok(flashcards.length >= 5);
  });

  // 6. Sandboxed Code Execution
  await test('JavaScript Sandbox Execution (Two Sum Logic)', async () => {
    const code = `
      function twoSum(nums, target) {
        return [0, 1];
      }
      console.log(JSON.stringify(twoSum([2, 7, 11, 15], 9)));
    `;
    const result = await codeExecutionService.execute('javascript', code);
    if (process.env.PISTON_API_URL) {
      assert.strictEqual(result.exitCode, 0);
      assert.ok(result.stdout.includes('[0,1]') || result.stdout.includes('[0, 1]'));
    } else {
      assert.strictEqual(result.exitCode, 1);
      assert.strictEqual(result.engine, 'Unavailable');
      assert.match(result.stderr, /No isolated execution service is available/i);
    }
  });

  // 7. Automated Coding Problem Evaluation
  await test('Problem Test Cases Evaluation Runner', async () => {
    const problem = db.getCodingProblemBySlug('two-sum');
    assert.ok(problem);
    const validCode = problem.starterCode.javascript;
    const evalResult = await codeExecutionService.evaluateProblem('two-sum', 'javascript', validCode);
    assert.strictEqual(typeof evalResult.totalTests, 'number');
    assert.ok(evalResult.results.length > 0);
  });

  // 8. AI Academic Service
  await test('AI Pedagogical Response Generator', async () => {
    const response = await aiService.generateResponse('Explain simply AVL tree rotations', 'College Tutor');
    assert.ok(response.length > 50);
    assert.ok(response.includes('Analogy') || response.includes('Core Idea') || response.includes('Tutor'));
  });

  // 9. Skill Roadmaps & Interviews
  await test('Skill Roadmaps & Interview Evaluator', () => {
    const roadmaps = db.getRoadmaps();
    assert.ok(roadmaps.length >= 2);
    const evalResult = aiService.evaluateInterview(
      'Explain Virtual DOM',
      'The virtual DOM is a lightweight JavaScript representation of the actual DOM tree. React diffs it to minimize direct DOM manipulations.',
      'Frontend Engineer'
    );
    assert.ok(evalResult.score >= 70);
    assert.ok(evalResult.strengths.length > 0);
  });

  // 10. Achievements & Gamification
  await test('Achievements System', () => {
    const achievements = db.getAchievements();
    assert.ok(achievements.length >= 6);
  });

  console.log(`\n========================================`);
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
