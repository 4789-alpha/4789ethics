import 'dart:io';
import 'package:flutter/material.dart';
import 'package:path/path.dart' as p;
import 'package:url_launcher/url_launcher.dart';

void main() => runApp(const LauncherApp());

class LauncherApp extends StatelessWidget {
  const LauncherApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: const Text('BSVRB Launcher')),
        body: const LauncherBody(),
      ),
    );
  }
}

class LauncherBody extends StatefulWidget {
  const LauncherBody({super.key});

  @override
  State<LauncherBody> createState() => _LauncherBodyState();
}

class _LauncherBodyState extends State<LauncherBody> {
  String _status = '';
  Process? _server;

  static const disclaimers = [
    'Diese Struktur wird ohne Gew\u00e4hrleistung bereitgestellt.',
    'Die Nutzung erfolgt auf eigene Verantwortung.',
    '4789 ist ein Standard f\u00fcr Verantwortung, keine Person und kein Glaubenssystem.',
    'Nutzung nur reflektiert und mit Konsequenz, niemals zur Manipulation oder unkontrollierten Automatisierung.'
  ];

  @override
  void initState() {
    super.initState();
    _status = disclaimers.join('\n');
  }

  Future<void> _start() async {
    if (_server != null) return;
    final script = p.join('tools', 'start-server.js');
    try {
      _server = await Process.start('node', [script]);
      unawaited(launchUrl(Uri.parse('http://localhost:8080/index.html')));
      setState(() => _status = 'Server gestartet.');
    } catch (e) {
      setState(() => _status = 'Fehler: $e');
    }
  }

  @override
  void dispose() {
    _server?.kill();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(child: SingleChildScrollView(child: Text(_status))),
          ElevatedButton(onPressed: _start, child: const Text('Interface starten')),
        ],
      ),
    );
  }
}

void unawaited(Future<void> future) {}
