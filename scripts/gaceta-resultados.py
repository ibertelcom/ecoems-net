#!/usr/bin/env python3
"""Convierte la Gaceta Electrónica de Resultados (PDF oficial de ECOEMS) en datos para el buscador por folio.

Uso:  python3 scripts/gaceta-resultados.py ruta/a/la/gaceta.pdf 2026

Genera en src/datos/resultados/<año>/:
  f/<prefijo6>.json   folios agrupados por sus 6 primeros dígitos: {"<3 últimos>": [modalidad, clave, aciertos, explicación]}
  crudo.json          catálogo de claves (plantel, dirección, especialidades), lugares disponibles, cortes y percentiles
La gaceta no trae nombres: solo folio, clave asignada, aciertos y explicación. No se agrega ningún dato.
"""
import json, re, statistics, subprocess, sys, collections, pathlib, shutil

pdf, anio = sys.argv[1], sys.argv[2]
txt = subprocess.run(["pdftotext", "-layout", pdf, "-"], capture_output=True, text=True).stdout.split("\n")

def idx(pred, desde=0):
    return next(i for i, l in enumerate(txt) if i >= desde and pred(l))

i_res = idx(lambda l: "Primera Sección" in l)
i_cat = idx(lambda l: "Listado de opciones educativas de ECOEMS" in l, i_res)
i_disp = idx(lambda l: "Listado de opciones educativas con lugares disponibles" in l, i_cat)
i_insc = idx(lambda l: "Cuarta sección" in l, i_disp)

# 1) Resultados por folio
fila = re.compile(r"(?<!\d)(\d{9})(?!\d)\s*([A-Z]\d{6})?\s*(\d{1,3}(?!\d))?\s*(ASI|PI|NP|SC|BI|<7)?")
recs, mod = {}, None
for l in txt[i_res:i_cat]:
    m = re.match(r"^\s*Modalidad ([123])\s*$", l)
    if m:
        mod = int(m.group(1)); continue
    if mod:
        for r in fila.finditer(l):
            f, c, a, e = r.groups()
            recs[f] = [mod, c or "", int(a) if a else None, e or ""]

# 2) Catálogo de claves (segunda sección) y lugares disponibles (tercera)
clv = re.compile(r"^\s*([A-Z]\d{6})\s+(.*)$")
def mayus(s):
    letras = [c for c in s if c.isalpha()]
    return bool(letras) and sum(c.isupper() for c in letras) / len(letras) > 0.85

def catalogo(lineas):
    parrafos, cur = [], []
    for l in lineas:
        if not l.strip() or re.match(r"^\s*Página \d+\s*$", l) or "Powered by TCPDF" in l:
            if cur: parrafos.append(cur); cur = []
        else:
            cur.append(l)
    if cur: parrafos.append(cur)
    cat, nombre, dire, ult = {}, "", "", None
    for p in parrafos:
        if not any(clv.match(l) for l in p):
            continue
        hdr, adr, i = [], [], 0
        while i < len(p) and not clv.match(p[i]):
            (hdr if (mayus(p[i]) and not adr) else adr).append(p[i].strip()); i += 1
        if hdr: nombre, dire = " ".join(hdr), " ".join(adr)
        elif adr: dire = " ".join(adr)
        for l in p[i:]:
            m = clv.match(l)
            if m:
                ult = m.group(1); cat[ult] = {"n": nombre, "d": dire, "e": [m.group(2).strip()]}
            elif ult:
                cat[ult]["e"].append(l.strip())
    return cat

ini_cat = idx(lambda l: re.match(r"^[A-ZÁÉÍÓÚÑ].* - ", l) is not None and not l.startswith(" "), i_cat + 20)
cat = catalogo(txt[ini_cat:i_disp])
disp = sorted(catalogo(txt[i_disp:i_insc]).keys())

# 3) Cortes (mínimo de aciertos de los asignados con examen) y percentiles
por_clave = collections.defaultdict(list)
for f, (m, c, a, e) in recs.items():
    if c[:1] in ("U", "I") and a is not None:
        por_clave[c].append(a)
cortes = {c: [min(v), round(statistics.median(v)), len(v)] for c, v in por_clave.items()}
sust = [a for (m, c, a, e) in recs.values() if m in (2, 3) and a]
cuenta = collections.Counter(sust)
menores, acum = [], 0
for x in range(0, 129):
    menores.append(round(100 * acum / len(sust), 1)); acum += cuenta.get(x, 0)

# 4) Escribir
dest = pathlib.Path(__file__).resolve().parent.parent / "src" / "datos" / "resultados" / anio
if dest.exists(): shutil.rmtree(dest)
(dest / "f").mkdir(parents=True)
grupos = collections.defaultdict(dict)
for f, v in recs.items():
    grupos[f[:6]][f[6:]] = v
for g, d in grupos.items():
    (dest / "f" / f"{g}.json").write_text(json.dumps(d, separators=(",", ":")))
tot = collections.Counter(v[0] for v in recs.values())
(dest / "crudo.json").write_text(json.dumps({
    "anio": anio, "total": len(recs), "modalidades": tot, "sustentantes": len(sust),
    "mediana": statistics.median(sust), "percentil_menor": menores,
    "cat": cat, "disp": disp, "cortes": cortes,
}, ensure_ascii=False, separators=(",", ":")))
sin_cat = sorted({v[1] for v in recs.values() if v[1] and v[1] not in cat})
print(f"{anio}: {len(recs)} folios {dict(tot)}; {len(cat)} claves; {len(disp)} con lugares; {len(grupos)} paquetes; claves sin catálogo: {sin_cat}")
