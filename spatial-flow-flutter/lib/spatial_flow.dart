/// SPATIAL FLOW -- Flutter v3.1.0
/// ================================
/// "The screen is not a canvas. It is a window into a continuous space."
///
/// Flutter port of @spatial-flow/core.
/// Uses Flutter's native SpringSimulation and AnimationController.
///
/// ```dart
/// import 'package:spatial_flow/spatial_flow.dart';
///
/// // Use a Soul constant:
/// final soul = SoulConstants.standard;
///
/// // Create a custom protocol:
/// final vortex = SpatialProtocol(
///   name: 'vortex',
///   soul: SoulConstants.standard,
///   states: ProtocolStates(
///     initial: {'opacity': 0.0, 'rotate': -90.0, 'scale': 0.6},
///     animate: {'opacity': 1.0, 'rotate': 0.0, 'scale': 1.0},
///   ),
///   staggerMs: 80,
/// );
///
/// // Use in a widget:
/// SpatialItem(protocol: vortex, index: 0, child: MyCard())
/// ```
///
/// Author: Michel EKANI
library spatial_flow;

export 'src/core/soul_constants.dart';
export 'src/core/spatial_speed.dart';
export 'src/core/reduced_motion.dart';
export 'src/core/scale_transition.dart';
export 'src/core/create_protocol.dart';
export 'src/core/types.dart';
export 'src/widgets/kinetic_item.dart';
export 'src/widgets/cascade_list.dart';
export 'src/widgets/spatial_item.dart';
export 'src/widgets/spatial_transition_builder.dart';
export 'src/widgets/chrysalis_container.dart';
export 'src/widgets/samsara_shift.dart';
export 'src/widgets/portal_expansion.dart';
export 'src/widgets/drop_water.dart';
export 'src/widgets/sequential_grid.dart';
export 'src/widgets/transmigrated_item.dart';
export 'src/widgets/reflex_matrix.dart';